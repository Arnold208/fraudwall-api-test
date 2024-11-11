// src/activity-log/activity-log.service.ts

import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ActivityLog } from "../entities/log-activity.entity";
import User from "src/user/entities/user.entity";
import { CreateLogTypeDto, UpdateLogTypeDto } from "../dto/create-log-type";
import { ActivityLogType } from "../entities/log-type.entity";

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(ActivityLogType)
    private readonly activityLogTypeRepository: Repository<ActivityLogType>
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
  async logActivity(
    userId: string,
    relatedEntityId: string,
    ipAddress: string,
    endpointUrl: string,
    details: string,
    logTypeId?: string
  ): Promise<void> {
    try {
      const getLogType = await this.getLogType(logTypeId);
      const activityLog = new ActivityLog();
      activityLog.userId = userId;
      activityLog.activityType = getLogType ? getLogType : null;
      activityLog.endPointUrl = endpointUrl;
      activityLog.ipAddress = ipAddress;
      activityLog.details = details;
      activityLog.relatedEntityId = relatedEntityId;

      await this.activityLogRepository.save(activityLog);
      this.logger.log("Activity logged successfully");
    } catch (error: any) {
      this.logger.error(
        `There was an error logging activity: ${error?.message}`
      );
      this.handleDatabaseError(error);
    }
  }

  async createLogType(logTypeData: CreateLogTypeDto) {
    try {
      const newLogType = new ActivityLogType();
      newLogType.name = logTypeData.name;
      newLogType.description = logTypeData.description;
      await this.activityLogTypeRepository.save(newLogType);
      this.logger.log("Activity log type created.");
      return {
        message: "Activity log type created",
        statusCode: HttpStatus.CREATED,
        data: newLogType,
      };
    } catch (error: any) {
      this.logger.error(
        `There was an error logging activity: ${error?.message}`
      );
      this.handleDatabaseError(error);
    }
  }

  async getLogTypes(): Promise<ActivityLogType[]> {
    try {
      return await this.activityLogTypeRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getLogTypeById(id: string): Promise<ActivityLogType> {
    try {
      const logTypeExist = await this.activityLogTypeRepository.findOne({
        where: { id },
      });
      if (logTypeExist) {
        return logTypeExist;
      }
      throw new NotFoundException("Activity LogType not found");
    } catch (error) {
      throw error;
    }
  }

  async updateLogType(id: string, logTypeData: UpdateLogTypeDto) {
    const { name, description } = logTypeData;
    try {
      const logTypeExist = await this.activityLogTypeRepository.findOne({
        where: { id },
      });
      if (!logTypeExist) {
        throw new NotFoundException("Activity LogType not found");
      }
      if (name) logTypeExist.name = name;
      if (description) logTypeExist.description = name;
      await this.activityLogTypeRepository.save(logTypeExist);
      return {
        message: "Activity log type udpated",
        data: logTypeExist,
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async getLogActivities(): Promise<ActivityLog[]> {
    try {
      return await this.activityLogRepository.find();
    } catch (error) {
      throw error;
    }
  }
  async getLogActivitiesByUserId(userId: string): Promise<ActivityLog[]> {
    try {
      return await this.activityLogRepository.find({
        where: { userId },
      });
    } catch (error) {
      throw error;
    }
  }

  async getLogActivitiesByRelatedEntityId(
    relatedEntityId: string
  ): Promise<ActivityLog[]> {
    try {
      return await this.activityLogRepository.find({
        where: { relatedEntityId },
      });
    } catch (error) {
      throw error;
    }
  }

  private async getLogType(logTypeId: string): Promise<ActivityLogType> {
    if (logTypeId) {
      const result = await this.activityLogTypeRepository.findOne({
        where: { name: "request" },
      });
      if (result) {
        return result;
      } else {
        throw new NotFoundException("Log type not found");
      }
    } else {
      return await this.activityLogTypeRepository.findOne({
        where: { name: "request" },
      });
    }
  }
}
