import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
  CreateReportPlatformDto,
  UpdateReportPlatformDto,
} from "../dto/report-platform.dto";
import ReportPlatform from "../model/report-platform";
import { ApiResponse } from "src/sms/type/api-response";

@Injectable()
export class ReportPlatformService {
  constructor(
    @InjectRepository(ReportPlatform)
    private readonly reportPlatformRepository: Repository<ReportPlatform>
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
  async getReportPlatforms(): Promise<ApiResponse> {
    try {
      const result = await this.reportPlatformRepository.find();
      return {
        message: "Report platforms found",
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async getReportPlatform(id: string): Promise<ApiResponse> {
    try {
      const reportPlatform = await this.reportPlatformRepository.findOne({
        where: { id },
      });

      if (!reportPlatform) {
        throw new NotFoundException(`ReportPlatform with ID ${id} not found`);
      }

      return {
        message: "Report platform found",
        statusCode: HttpStatus.OK,
        data: reportPlatform,
      };
    } catch (error) {
      throw error;
    }
  }

  async createReportPlatform(
    payload: CreateReportPlatformDto
  ): Promise<object> {
    try {
      const newReportPlatform = this.reportPlatformRepository.create(payload);
      await this.reportPlatformRepository.save(newReportPlatform);

      return {
        message: "New report platform created",
        statusCode: HttpStatus.CREATED,
        data: newReportPlatform,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async updateReportPlatform(
    id: string,
    payload: UpdateReportPlatformDto
  ): Promise<object> {
    try {
      const platformExist = await this.reportPlatformRepository.findOne({
        where: { id },
      });

      if (!platformExist) {
        throw new NotFoundException("ReportPlatform not found");
      }

      this.reportPlatformRepository.merge(platformExist, payload);
      await this.reportPlatformRepository.save(platformExist);

      return {
        message: "Report platform updated successfully",
        statusCode: HttpStatus.NO_CONTENT,
        data: platformExist,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }
}
