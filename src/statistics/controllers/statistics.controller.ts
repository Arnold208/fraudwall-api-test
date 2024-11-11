import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { StatisticsService } from "../services/statistics.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";

import { RoleGuard } from "src/authentication/guards/role.guard";
import { Roles } from "src/authorization/decorators/role.decorator";

@UseGuards(JwtAuthGuard)
@UseGuards(RoleGuard)
@Roles("admin", "super_user")
@ApiTags("Statistics")
@Controller("statistics")
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public async getStatistics(): Promise<any> {
    return await this.statisticsService.getOrigins();
  }

  @UseGuards(JwtAuthGuard)
  @Get("report/dashboard")
  public async getDashboardReport(): Promise<any> {
    return await this.statisticsService.generateDashboardReport();
  }

  @Get("yearly")
  @ApiOperation({ summary: "Get yearly report data" })
  @ApiQuery({
    name: "year",
    required: false,
    description:
      "The year for which the report data should be retrieved. Defaults to the current year if not provided.",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Yearly report data fetched successfully",
    schema: {
      example: {
        year: 2024,
        report: [1, 2, 0, 1, 6, 0, 12, 99, 21, 30, 0, 0],
        fraudNumbers: [1, 2, 0, 1, 6, 0, 12, 99, 21, 30, 0, 0],
        platformPercentagesFromReport: {
          "Platform A": 40.25,
          "Platform B": 59.75,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Bad request, invalid parameters" })
  async getYearlyReport(@Query("year") year?: number): Promise<any> {
    return this.statisticsService.getYearlyReportData(year);
  }

  @Get("yearly/verification/report/origin")
  @ApiOperation({
    summary: "Get yearly report and verification origin statistics",
  })
  @ApiQuery({
    name: "year",
    required: false,
    description:
      "The year for which the report and verification origin statistics should be retrieved. Defaults to the current year if not provided.",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description:
      "Yearly report and verification origin data fetched successfully",
    schema: {
      example: {
        year: 2024,
        report: [1, 2, 0, 1, 6, 0, 12, 99, 21, 30, 0, 0],
        verification: [1, 2, 0, 1, 6, 0, 12, 99, 21, 30, 0, 0],
        platformPercentagesFromReport: {
          "Platform A": 40.25,
          "Platform B": 59.75,
        },
        platformPercentagesFromVerification: {
          "Platform A": 30.55,
          "Platform B": 69.45,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Bad request, invalid parameters" })
  async getYearlyVerificationAndReportOriginStatistics(
    @Query("year") year?: number
  ): Promise<any> {
    return this.statisticsService.getOriginRequestStatistics(year);
  }
}
