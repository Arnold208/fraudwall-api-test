import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import FraudNumberEntity from "../model/fraud-number.entity";

import { CreateFraudNumberDto } from "../dto/create-fraud-number.dto";
import RiskLevel from "../model/risk-level.entity";
import Report from "../../report/model/report.entity";
import { instanceToPlain } from "class-transformer";
import { ApiResponse } from "src/sms/type/api-response";
import { OriginEnum } from "src/shared/enums/origin.enum";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { ModelNameEnum } from "src/shared/enums/model-name.enum";

@Injectable()
export class FraudNumberService {
  private readonly logger = new Logger(FraudNumberService.name);
  // contstructor
  constructor(
    @InjectRepository(FraudNumberEntity)
    private readonly fraudNumberRepo: Repository<FraudNumberEntity>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(RiskLevel)
    private readonly riskLevelRepository: Repository<RiskLevel>,
    @InjectQueue("originLog")
    private readonly createOrigin: Queue
  ) {}

  private handleDatabaseError(error: any): void {
    switch (error?.code) {
      case "23502":
        throw new BadRequestException("Please provide all required fields.");
      case "23503":
        throw new BadRequestException("Foreign key not provided.");
      case "23505":
        throw new ConflictException("Record already exist");
      case "42703":
        throw new BadRequestException("Valid payload required");
      default:
        throw error;
    }
  }

  public async createFraudNumber(
    phoneNumber: string,
    data: CreateFraudNumberDto
  ): Promise<object> {
    try {
      // Check if fraud number exists
      const fraudNumberExist = await this.fraudNumberRepo.findOne({
        where: { fraudNumber: phoneNumber },
      });
      if (fraudNumberExist) {
        throw new ConflictException(
          `Phone number already exists: ${phoneNumber}`
        );
      }

      // Create a new fraud number entity
      let newFraudNumber = new FraudNumberEntity();
      newFraudNumber.fraudNumber = phoneNumber;

      // Set visibility based on conditions
      newFraudNumber.visibility = !!(
        data.visibility &&
        data.reported &&
        data.investigated &&
        data.approved
      );

      // Save the new fraud number
      let saveFraudNumber = await this.fraudNumberRepo.save(newFraudNumber);

      return {
        message: "Fraud number created successfully",
        data: saveFraudNumber,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // get all fraud numbers
  public async getFraudNumbers(): Promise<ApiResponse> {
    try {
      const result = await this.fraudNumberRepo.find({
        relations: {
          riskLevel: true,
        },
        order: {
          modifiedAt: "DESC",
        },
      });
      return {
        message: "Fraud numbers fetched",
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  // find fraud number by id
  public async getFraudNumberById(id: string): Promise<ApiResponse> {
    try {
      let results = await this.fraudNumberRepo.findOne({
        where: { fraudNumberId: id },
        relations: {
          riskLevel: true,
          reports: {
            reportPlatForm: true,
          },
        },
      });

      if (results) {
        return {
          message: "Fraud number found",
          statusCode: HttpStatus.OK,
          data: results,
        };
      }

      throw new NotFoundException(`Fraud-number with: ${id} Not Found`);
    } catch (error) {
      throw error;
    }
  }

  async updateReports(fraudNumber: FraudNumberEntity): Promise<void> {
    try {
      const reports = await this.reportRepository.find({
        where: { suspectNumber: fraudNumber.fraudNumber },
      });
      fraudNumber.reports = reports;
      await this.fraudNumberRepo.save(fraudNumber);
      this.logger.log("Report updated on number");
    } catch (error) {
      this.logger.error("Error occurred while updating reports:", error);
      throw new Error("Error occurred while updating reports");
    }
  }

  async calculateRiskLevel(supectNumber: string): Promise<void> {
    try {
      const fraudNumber = await this.fraudNumberRepo.findOne({
        where: {
          fraudNumber: supectNumber,
        },
        relations: {
          reports: true,
        },
      });
      if (fraudNumber.reports && fraudNumber.reports.length > 0) {
        const matchingRiskLevel = await this.findMatchingRiskLevel(fraudNumber);
        if (matchingRiskLevel) {
          fraudNumber.riskLevel = matchingRiskLevel;
          await this.fraudNumberRepo.save(fraudNumber);
        }
      }
    } catch (error) {
      this.logger.error("Error occurred while calculating risk level:", error);
      throw new Error("Error occurred while calculating risk level");
    }
  }

  private async findMatchingRiskLevel(
    fraudNumber: FraudNumberEntity
  ): Promise<RiskLevel | undefined> {
    try {
      const reportCount = fraudNumber.reports.length;

      const matchingRiskLevels = await this.riskLevelRepository
        .createQueryBuilder("riskLevel")
        .where("riskLevel.reportCount >= :reportCount", { reportCount })
        .orderBy("riskLevel.reportCount", "ASC")
        .getMany();

      return matchingRiskLevels.length > 0 ? matchingRiskLevels[0] : undefined;
    } catch (error) {
      this.logger.error("Error in findMatchingRiskLevel:", error);
      throw new Error("Error in findMatchingRiskLevel");
    }
  }

  // remove phone number
  public async removeFraudNumberById(id: string) {
    try {
      let fraudNumberFound = await this.fraudNumberRepo.findOne({
        where: { fraudNumberId: id },
      });
      if (fraudNumberFound !== null) {
        await this.fraudNumberRepo.remove(fraudNumberFound);
        return {
          message: "Fraud number removed successfully",
          status: HttpStatus.OK,
          error: null,
        };
      }
      throw new HttpException(
        `Fraud Number ${id} Not Found`,
        HttpStatus.NOT_FOUND
      );
    } catch (error) {
      throw error;
    }
  }

  // get total fraud numbers
  public async getTotalFraudNumbers(): Promise<number> {
    try {
      return await this.fraudNumberRepo.count();
    } catch (error) {
      throw error;
    }
  }

  // validate phone number
  public async validatePhoneNumber(
    phoneNumber: string,
    origin: OriginEnum
  ): Promise<ApiResponse> {
    try {
      const foundFraudNumber = await this.fraudNumberRepo.findOne({
        where: {
          fraudNumber: phoneNumber,
          visibility: true,
          investigated: true,
          approved: true,
        },
        relations: {
          riskLevel: true,
          reports: {
            reportPlatForm: true,
          },
        },
      });
      const originPayload = {
        modelName: ModelNameEnum.Fraud,
        originName: origin,
        suspectNumber: phoneNumber,
      };

      await this.createOrigin.add("createOrigin", { ...originPayload });
      if (foundFraudNumber) {
        const fraudNumberDto = instanceToPlain(foundFraudNumber, {
          excludeExtraneousValues: true,
        }) as FraudNumberEntity;
        return {
          message: "Fraud number found",
          statusCode: HttpStatus.FOUND,
          error: null,
          data: fraudNumberDto,
        };
      }
      return {
        message: `Phone number: ${phoneNumber} not found`,
        statusCode: HttpStatus.OK,
        error: null,
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  // change fraud number visibility status
  public async changeFraudNumberVisibility(phoneNumber: string) {
    try {
      const fraudNumber = await this.fraudNumberRepo.findOne({
        where: { fraudNumber: phoneNumber },
      });

      if (!fraudNumber) {
        throw new NotFoundException(`Fraud Number ${phoneNumber} Not Found`);
      }

      // Check conditions for changing visibility
      if (
        fraudNumber.reported &&
        fraudNumber.investigated &&
        fraudNumber.approved
      ) {
        // Toggle visibility
        fraudNumber.visibility = !fraudNumber.visibility;
        const updatedFraudNumber = await this.fraudNumberRepo.save(fraudNumber);

        const message = `Visibility changed to ${updatedFraudNumber.visibility}`;
        return { message, data: updatedFraudNumber, statusCode: HttpStatus.OK };
      } else {
        throw new BadRequestException(
          "Conditions for changing visibility are not met."
        );
      }
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }
}
