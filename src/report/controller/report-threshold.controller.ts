import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  UpdateCreateReportThresholdDto,
} from "../dto/threshold.dto";
import { ReportThresholdService } from "../service/threshold.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { Roles } from "src/authorization/decorators/role.decorator";
import { RoleGuard } from "src/authentication/guards/role.guard";

@ApiTags("Reports Threshold")
@Controller("report-threshold")
export class ReportThresholdController {
  constructor(
    private readonly reportThresholdService: ReportThresholdService
  ) {}


  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getReportThresholds() {
    return await this.reportThresholdService.getReportThresholds();
  }

  @UseGuards(RoleGuard)
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateReortThreshold(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() payload: UpdateCreateReportThresholdDto
  ) {
    return await this.reportThresholdService.updateReortThreshold(id, payload);
  }
}
