//report threshold

import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import ReportThreshold from "../model/report-threshold.entity";
import { UpdateCreateReportThresholdDto } from "../dto/threshold.dto";
import { ApiResponse } from "src/sms/type/api-response";

@Injectable()
export class ReportThresholdService {
  constructor(
    @InjectRepository(ReportThreshold)
    private readonly reportThresholdRepository: Repository<ReportThreshold>
  ) {}

  private handleDatabaseError(error: any): void {
    switch (error?.code) {
      case "23502":
        throw new BadRequestException(
          "Not null violation: Please provide all required fields."
        );
      case "23503":
        throw new BadRequestException(
          "Foreign key violation: The referenced record does not exist."
        );
      case "23505":
        throw new ConflictException(
          "Unique violation: The provided data violates a unique constraint."
        );
      case "42703":
        throw new BadRequestException(
          "Undefined column: A provided column does not exist in the table."
        );
      default:
        throw error;
    }
  }
  async getReportThresholds(): Promise<ApiResponse> {
    try {
      const result = await this.reportThresholdRepository.find();
      return {
        message: "Report thresholds found",
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  // async getReportThreshold(id: string): Promise<ReportThreshold> {
  //   try {
  //     const reportThreshold = await this.reportThresholdRepository.findOne({
  //       where: { id },
  //     });

  //     if (!reportThreshold) {
  //       throw new NotFoundException(`ReportThreshold with ID ${id} not found`);
  //     }

  //     return reportThreshold;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async createReportThreshold(
  //   payload: CreateReportThresholdDto
  // ): Promise<object> {
  //   try {
  //     const newReportThreshold = new ReportThreshold();
  //     newReportThreshold.reportCount = payload.reportCount;
  //     newReportThreshold.name = payload.name;
  //     newReportThreshold.description = payload.description;

  //     await this.reportThresholdRepository.save(newReportThreshold);
  //     return {
  //       message: "New threshold created",
  //       statusCode: HttpStatus.CREATED,
  //     };
  //   } catch (error) {
  //     this.handleDatabaseError(error);
  //   }
  // }

  async updateReortThreshold(
    id: string,
    payload: UpdateCreateReportThresholdDto
  ): Promise<object> {
    try {
      const thresholdExist = await this.reportThresholdRepository.findOne({
        where: { id },
      });
      if (!thresholdExist) {
        throw new NotFoundException("Threshold  not found");
      }
      if (payload.reportCount) thresholdExist.reportCount = payload.reportCount;
      if (payload.description) thresholdExist.description = payload.description;
      await this.reportThresholdRepository.save(thresholdExist);

      return {
        message: "Report threshold updated successfully",
        statusCode: HttpStatus.NO_CONTENT,
        data: thresholdExist,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }
}
