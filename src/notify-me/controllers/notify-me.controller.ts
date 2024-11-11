import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Body,
} from "@nestjs/common";

import { ApiBody, ApiTags } from "@nestjs/swagger";
import FraudNumberEntity from "../model/notify-me.entity";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import {
  CreateSubscriptionDto,
  RemoveSubscriberDto,
} from "../dto/notify-me.dto";
import { Roles } from "src/authorization/decorators/role.decorator";
import { NotifyMeService } from "../services/notify-me.service";
import { RoleGuard } from "src/authentication/guards/role.guard";
import { NotificationDto } from "../dto/notification.dto";
import { ApiResponse } from "src/sms/type/api-response";

@ApiTags("Notify-Me")
@Controller("notify-me")
export class NotifyMeController {
  constructor(private readonly notifyMeService: NotifyMeService) {}

  @Post()
  @ApiBody({ type: CreateSubscriptionDto })
  public async create(@Body() payload: CreateSubscriptionDto) {
    return await this.notifyMeService.create(payload);
  }


  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Post("send/notification")
  @ApiBody({ type: NotificationDto })
  public async sendBatchNotificationToSubscribers(
    @Body() payload: NotificationDto
  ) {
    return await this.notifyMeService.sendNotification(payload);
  }


  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Get()
  public async getAll(): Promise<ApiResponse> {
    return await this.notifyMeService.getAll();
  }

 
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Get(":id")
  public async getOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.notifyMeService.getById(id);
  }

  
  @ApiBody({ type: RemoveSubscriberDto })
  @Delete()
  public async remove(@Body() payload: RemoveSubscriberDto) {
    return await this.notifyMeService.removeById(payload);
  }
}
