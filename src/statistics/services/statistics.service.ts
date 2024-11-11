import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ApiResponse } from "src/sms/type/api-response";
import OriginEntity from "../model/origin.entity";
import FraudNumberEntity from "src/fraud-number/model/fraud-number.entity";
import Report from "src/report/model/report.entity";
import CaseFile from "src/case-file/entities/case-file.entity";
import { OriginEnum } from "src/shared/enums/origin.enum";
import * as moment from "moment";
import ReportPlatform from "src/report/model/report-platform";
import { ModelNameEnum } from "src/shared/enums/model-name.enum";

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);
  // contstructor
  constructor(
    @InjectRepository(OriginEntity)
    private readonly originRepository: Repository<OriginEntity>,

    @InjectRepository(FraudNumberEntity)
    private readonly fraudNumberRepository: Repository<FraudNumberEntity>,

    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,

    @InjectRepository(CaseFile)
    private readonly caseFileRepository: Repository<CaseFile>,
    @InjectRepository(ReportPlatform)
    private readonly reportPlatformRepository: Repository<ReportPlatform>
  ) {}

  private handleDatabaseError(error: any): void {
    switch (error?.code) {
      case "23502":
        throw new BadRequestException("Please provide all required fields.");
      case "23503":
        throw new BadRequestException("Foreign key not provided.");
      case "23505":
        throw new ConflictException("Record already exist");
      case "42703":
        throw new BadRequestException("Valid payload required");
      default:
        throw error;
    }
  }

  public async generateDashboardReport(): Promise<ApiResponse> {
    try {
      // Get the total number of reports
      const totalReports = await this.reportRepository.count();

      // Get the total number of fraud numbers with visibility, reported, investigated, and approved as true
      const fraudNumbers = await this.fraudNumberRepository.find({
        where: [
          { visibility: true },
          { reported: true },
          { investigated: true },
          { approved: true },
        ],
      });

      const totalVisibleFraudNumbers = fraudNumbers.filter(
        (fraud) => fraud.visibility
      ).length;
      const totalReportedFraudNumbers = fraudNumbers.filter(
        (fraud) => fraud.reported
      ).length;
      const totalInvestigatedFraudNumbers = fraudNumbers.filter(
        (fraud) => fraud.investigated
      ).length;
      const totalApprovedFraudNumbers = fraudNumbers.filter(
        (fraud) => fraud.approved
      ).length;

      // Get the total number of case files
      const totalCaseFiles = await this.caseFileRepository.count();

      // Get the total number of unique reporters in the reports
      const uniqueReporters = await this.reportRepository
        .createQueryBuilder("report")
        .select("COUNT(DISTINCT report.reporterNumber)", "total")
        .getRawOne();

      const totalReporters = parseInt(uniqueReporters.total, 10);

      // Get total origins by platform
      const totalOriginsFromWeb = await this.originRepository.count({
        where: { origin: OriginEnum.Web },
      });
      const totalOriginsFromUSSD = await this.originRepository.count({
        where: { origin: OriginEnum.USSD },
      });
      const totalOriginsFromTelegram = await this.originRepository.count({
        where: { origin: OriginEnum.Telegram },
      });

      // Create the report
      const reportData = {
        totalReports,
        totalVisibleFraudNumbers,
        totalReportedFraudNumbers,
        totalInvestigatedFraudNumbers,
        totalApprovedFraudNumbers,
        totalCaseFiles,
        totalReporters,
        totalOriginsFromWeb,
        totalOriginsFromUSSD,
        totalOriginsFromTelegram,
      };

      return {
        message: "Statistics report generated successfully",
        statusCode: HttpStatus.OK,
        data: reportData,
      };
    } catch (error) {
      this.logger.error("Failed to generate statistics report", error);
      this.handleDatabaseError(error);
    }
  }

  //
  public async getOrigins(): Promise<ApiResponse> {
    try {
      const result = await this.originRepository.find({order: {
        modifiedAt: 'DESC'
      }});
      return {
        message: "Origins fetched",
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async getYearlyReportData(year?: number) {
    try {
      // If no year is provided, use the current year
      const currentYear = year || moment().year();

      // Initialize arrays for reports and fraudNumbers (Jan-Dec)
      const reportCounts: number[] = Array(12).fill(0);
      const fraudNumberCounts: number[] = Array(12).fill(0);

      // Fetch all reports for the given year
      const reports = await this.reportRepository
        .createQueryBuilder("report")
        .where("EXTRACT(YEAR FROM report.createdAt) = :year", {
          year: currentYear,
        })
        .getMany();

      // Fetch all fraud numbers for the given year where all required properties are true
      const fraudNumbers = await this.fraudNumberRepository
        .createQueryBuilder("fraudNumber")
        .where("fraudNumber.visibility = true")
        .andWhere("fraudNumber.reported = true")
        .andWhere("fraudNumber.investigated = true")
        .andWhere("fraudNumber.approved = true")
        .getMany();

      // Iterate through reports and count by month
      reports.forEach((report) => {
        const month = moment(report.createdAt).month(); // get month index (0-11)
        reportCounts[month] += 1;
      });

      // Iterate through fraud numbers and count by month
      fraudNumbers.forEach((fraudNumber) => {
        const month = moment(fraudNumber.createdAt).month(); // get month index (0-11)
        fraudNumberCounts[month] += 1;
      });

      // Calculate percentages of reports from each platform
      const platformPercentagesFromReport =
        await this.calculatePlatformPercentages(reports, currentYear);

      const data = {
        year: currentYear,
        report: reportCounts,
        fraudNumbers: fraudNumberCounts,
        platformPercentagesFromReport,
      };

      return {
        message: "Fraud number and Report Statistics fetched successfully",
        statusCode: HttpStatus.OK,
        data,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async calculatePlatformPercentages(reports: Report[], year: number) {
    // Get all platforms along with their reports
    const platforms = await this.reportPlatformRepository.find({
      relations: ["reports"],
    });

    // Initialize an object to store the platform percentages
    const platformPercentages: Record<string, number> = {};

    // Total number of reports for the year
    const totalReports = reports.length;

    platforms.forEach((platform) => {
      const platformReportsCount = platform.reports.filter(
        (report) => moment(report.createdAt).year() === year
      ).length;

      const platformName = platform.displayName || platform.name;

      // Calculate the percentage and store in the platformPercentages object
      const percentage =
        totalReports > 0
          ? parseFloat(((platformReportsCount / totalReports) * 100).toFixed(2))
          : 0;

      platformPercentages[platformName] = percentage;
    });

    return platformPercentages;
  }

  async getOriginRequestStatistics(year?: number) {
    try {
      // If no year is provided, use the current year
      const currentYear = year || moment().year();

      // Initialize arrays for reports and fraudNumbers (Jan-Dec)
      const reportCounts: number[] = Array(12).fill(0);
      const verificationCounts: number[] = Array(12).fill(0);

      // Fetch all reports for the given year
      const reports = await this.originRepository
        .createQueryBuilder("origin")
        .where("EXTRACT(YEAR FROM origin.createdAt) = :year", {
          year: currentYear,
        })
        .andWhere("origin.modelName = :modelName", {
          modelName: ModelNameEnum.Report,
        })
        .getMany();

      // Fetch all fraud verifications for the given year
      const frauds = await this.originRepository
        .createQueryBuilder("origin")
        .where("EXTRACT(YEAR FROM origin.createdAt) = :year", {
          year: currentYear,
        })
        .andWhere("origin.modelName = :modelName", {
          modelName: ModelNameEnum.Fraud,
        })
        .getMany();

      // Iterate through reports and frauds and count by month
      reports.forEach((report) => {
        const month = moment(report.createdAt).month(); // get month index (0-11)
        reportCounts[month] += 1;
      });

      frauds.forEach((fraud) => {
        const month = moment(fraud.createdAt).month(); // get month index (0-11)
        verificationCounts[month] += 1;
      });

      // Calculate platform percentages for reports and fraud verifications
      const platformPercentagesFromReports =
        await this.calculateOriginPercentages(reports, currentYear);
      const platformPercentagesFromVerification =
        await this.calculateOriginPercentages(frauds, currentYear);

      const data = {
        year: currentYear,
        reportOriginCount: reportCounts,
        verificationOriginCount: verificationCounts,
        platformPercentagesFromReports,
        platformPercentagesFromVerification,
      };

      return {
        message:
          "Yearly Report and Verification Origins Statistics fetched successfully",
        statusCode: HttpStatus.OK,
        data,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async calculateOriginPercentages(
    origins: OriginEntity[],
    year: number
  ) {
    // Initialize an object to store the platform percentages
    const platformPercentages: Record<string, number> = {};

    // Total number of reports or frauds for the year
    const totalOrigins = origins.length;

    Object.values(OriginEnum).forEach((originName) => {
      const originCount = origins.filter(
        (origin) =>
          origin.origin === originName
      ).length;

      // Calculate the percentage and store it in the platformPercentages object
      const percentage =
        totalOrigins > 0
          ? parseFloat(((originCount / totalOrigins) * 100).toFixed(2))
          : 0;

      platformPercentages[originName] = percentage;
    });

    return platformPercentages;
  }
}
