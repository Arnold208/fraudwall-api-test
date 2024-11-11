import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Body,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";

import { Roles } from "src/authorization/decorators/role.decorator";
import { FeedbackService } from "../services/feedback.service";
import { FeedbackDto } from "../dto/feedback.dto";
import { ApiResponse } from "src/sms/type/api-response";
import { RoleGuard } from "src/authentication/guards/role.guard";

@ApiTags("Feedbacks and Contacts")
@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiBody({ type: FeedbackDto })
  public async create(@Body() payload: FeedbackDto) {
    return await this.feedbackService.createFeedback(payload);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Get()
  @ApiQuery({ type: "integer", required: false, name: "page" })
  @ApiQuery({ type: "integer", required: false, name: "pageSize" })
  public async getFeedbacks(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("pageSize", new DefaultValuePipe(10), ParseIntPipe)
    pageSize: number = 10
  ): Promise<ApiResponse> {
    return await this.feedbackService.getFeedbacks(page, pageSize);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Get(":feedbackId")
  public async getFraudNumber(
    @Param("feedbackId", new ParseUUIDPipe()) feedbackId: string
  ) {
    return await this.feedbackService.getFeedbackById(feedbackId);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Delete(":feedbackId")
  public async remove(
    @Param("feedbackId", new ParseUUIDPipe()) feedbackId: string
  ) {
    return await this.feedbackService.removeFeedback(feedbackId);
  }
}
