import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  CreateReportPlatformDto,
  UpdateReportPlatformDto,
} from "../dto/report-platform.dto";
import { ReportPlatformService } from "../service/report-platform.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { Roles } from "src/authorization/decorators/role.decorator";
import { RoleGuard } from "src/authentication/guards/role.guard";

@ApiTags("Report Platforms")
@Controller("report-platforms")
export class ReportPlatformController {
  constructor(private readonly reportPlatformService: ReportPlatformService) {}

  @Get()
  async getReportPlatforms() {
    return await this.reportPlatformService.getReportPlatforms();
  }

  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getReportPlatform(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.reportPlatformService.getReportPlatform(id);
  }

  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @Post()
  async createReportPlatform(@Body() payload: CreateReportPlatformDto) {
    return await this.reportPlatformService.createReportPlatform(payload);
  }

  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateReportPlatform(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() payload: UpdateReportPlatformDto
  ) {
    return await this.reportPlatformService.updateReportPlatform(id, payload);
  }
}
