// src/activity-log/activity-log.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { ActivityLog } from "../entities/log-activity.entity";
import { ActivityLogService } from "../services/activity-log.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { Roles } from "src/authorization/decorators/role.decorator";
import { CreateLogTypeDto, UpdateLogTypeDto } from "../dto/create-log-type";
import { ActivityLogType } from "../entities/log-type.entity";
import { RoleGuard } from "src/authentication/guards/role.guard";

@ApiTags("Activity Logs")
@UseGuards(RoleGuard)
@Roles("admin", "super_user")
@UseGuards(JwtAuthGuard)
@Controller("activity-log")
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  async getLogActivities(): Promise<ActivityLog[]> {
    return await this.activityLogService.getLogActivities();
  }

  @Get("user/:userId")
  async getLogActivitiesByUserId(
    @Param("userId", new ParseUUIDPipe()) userId: string
  ): Promise<ActivityLog[]> {
    return await this.activityLogService.getLogActivitiesByUserId(userId);
  }

  @Post("log-types")
  async createLogType(@Body() logTypeData: CreateLogTypeDto) {
    return await this.activityLogService.createLogType(logTypeData);
  }

  @Get("log-types")
  async getLogTypes(): Promise<ActivityLogType[]> {
    try {
      return await this.activityLogService.getLogTypes();
    } catch (error) {
      // Handle specific errors if needed
      throw error;
    }
  }

  @Get("log/types/:id")
  async getLogTypeById(
    @Param("id", new ParseUUIDPipe()) id: string
  ): Promise<ActivityLogType> {
    return await this.activityLogService.getLogTypeById(id);
  }

  @Patch("log/types/:id")
  async updateLogType(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() logTypeData: UpdateLogTypeDto
  ) {
    return await this.activityLogService.updateLogType(id, logTypeData);
  }

  @Get("/related/entity/:entityId")
  async getLogActivitiesByRelatedEntityId(
    @Param("entityId") entityId: string
  ): Promise<ActivityLog[]> {
    return await this.activityLogService.getLogActivitiesByRelatedEntityId(
      entityId
    );
  }
}
