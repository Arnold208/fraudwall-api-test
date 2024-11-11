import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Body,
  Req,
  Query,
} from "@nestjs/common";
import { FraudNumberService } from "../services/fraud-number.service";
import { ApiBody, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { CreateFraudNumberDto } from "../dto/create-fraud-number.dto";
import { Request } from "express";
import { ActivityLogService } from "src/log/services/activity-log.service";
import { GetCurrentUser } from "src/authorization/decorators/current-user.decorator";
import { Roles } from "src/authorization/decorators/role.decorator";
import { PhoneNumberDto } from "src/sms/dto/phone-number.dto";
import { ApiResponse } from "src/sms/type/api-response";
import { OriginEnum } from "src/shared/enums/origin.enum";
import { JwtPayload } from "src/authentication/dtos/jwt.payload";
import { RoleGuard } from "src/authentication/guards/role.guard";

@ApiTags("Fraud Numbers")
@Controller("fraud-number")
export class FraudNumberController {
  constructor(
    private readonly fraudNumberService: FraudNumberService,
    private readonly activityLogService: ActivityLogService
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Post(":phoneNumber")
  @ApiParam({
    name: "phoneNumber",
    type: "string",
    required: true,
    format: "phone",
    example: "+1234567890",
  })
  @ApiBody({ type: CreateFraudNumberDto })
  public async createFraudNumber(
    @Param() data: PhoneNumberDto,
    @Body() payload: CreateFraudNumberDto
  ) {
    return await this.fraudNumberService.createFraudNumber(
      data.phoneNumber,
      payload
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Get()
  public async getFraudNumbers(): Promise<ApiResponse> {
    return await this.fraudNumberService.getFraudNumbers();
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Get(":id")
  public async getFraudNumber(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.fraudNumberService.getFraudNumberById(id);
  }

  // validate phone number by phone number
  @Get("validate/:phoneNumber")
  @ApiParam({
    name: "phoneNumber",
    type: "string",
    required: true,
    format: "phone",
    example: "+1234567890",
  })
  @ApiQuery({ name: "origin", enum: OriginEnum })
  public async validatePhoneNumber(
    @Param() payload: PhoneNumberDto,
    @Query("origin") origin: OriginEnum
  ) {
    return await this.fraudNumberService.validatePhoneNumber(
      payload?.phoneNumber,
      origin
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Get("count")
  public async getTotalFraudNumbers() {
    return await this.fraudNumberService.getTotalFraudNumbers();
  }

  @Roles("admin","super_user")
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: "phoneNumber",
    type: "string",
    required: true,
    format: "phone",
    example: "+1234567890",
  })
  @Patch("change/visibility/:phoneNumber")
  public async changeVisibilityStatus(
    @Param() payload: PhoneNumberDto,
    @Req() request: Request,
    @GetCurrentUser() user: JwtPayload
  ) {
    const result = await this.fraudNumberService.changeFraudNumberVisibility(
      payload.phoneNumber
    );

    // Get the client's IP address more reliably
    const ipAddress: string = this.getClientIPAddress(request);
    const { data, message } = result;
    const endpointUrl = request?.url;
    const userId = user?.sub;
    const relatedEntityId = data?.fraudNumberId;
    const details = message;

    await this.activityLogService.logActivity(
      userId,
      relatedEntityId,
      ipAddress,
      endpointUrl,
      details
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Delete(":id")
  public async remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.fraudNumberService.removeFraudNumberById(id);
  }

  private getClientIPAddress(request: Request): string {
    return Array.isArray(request.headers["x-real-ip"])
      ? request.headers["x-real-ip"][0]
      : request.headers["x-real-ip"] || request.socket.remoteAddress?.[0] || "";
  }
}
