import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import {
  CreateBackOfficeReportDto,
  CreateReportDto,
} from "../dto/create.report.dto";
import Report from "../model/report.entity";

import { CaseFileService } from "../../case-file/services/case-file.service";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import ReportThreshold from "../model/report-threshold.entity";
import FraudNumberEntity from "src/fraud-number/model/fraud-number.entity";
import ReportPlatform from "../model/report-platform";
import { FraudNumberService } from "src/fraud-number/services/fraud-number.service";
import { ApiResponse } from "src/sms/type/api-response";
import { OriginEnum } from "src/shared/enums/origin.enum";
import { ModelNameEnum } from "src/shared/enums/model-name.enum";
import { AzureBlobService } from "src/media/service/azure/azure-file-upload.service";
@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(ReportThreshold)
    private readonly reportThresholdRepository: Repository<ReportThreshold>,

    private readonly azureBlobService: AzureBlobService,

    @InjectRepository(FraudNumberEntity)
    private readonly fraudNumberRepository: Repository<FraudNumberEntity>,

    @InjectRepository(ReportPlatform)
    private readonly reportPlatformRepository: Repository<ReportPlatform>,

    private caseFileService: CaseFileService,
    @InjectQueue("upload-files") private readonly uploadFilesQueue: Queue,
    @InjectQueue("notify-me")
    private readonly sendMessageQueue: Queue,

    @InjectQueue("originLog")
    private readonly createOrigin: Queue,

    private readonly fraudNumberService: FraudNumberService
  ) {}

  private handleDatabaseError(error: any): void {
    switch (error?.code) {
      case "23502":
        throw new BadRequestException(
          "Kindly ensure all mandatory fields are provided."
        );
      case "23503":
        throw new BadRequestException("Required foreign key is missing");
      case "23505":
        throw new ConflictException(
          "Cannot report the same number more than once"
        );
      case "42703":
        throw new BadRequestException("The provided payload is not valid");
      default:
        throw error;
    }
  }

  // // get all reports on suspect
  public async getReports(): Promise<ApiResponse> {
    try {
      const result = await this.reportRepository.find({
        where: { archived: false },
        relations: {
          reportPlatForm: true,
        },
        order: {
          modifiedAt: "DESC",
        },
      });

      return {
        message: "Reports fetch successfully",
        statusCode: HttpStatus.OK,
        error: null,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }


  public async getArchivedReports(): Promise<ApiResponse> {
    try {
      const result = await this.reportRepository.find({
        where: { archived: true, reportPlatForm: true },
      });
      return {
        message: "Archived data fetched successfuly",
        statusCode: HttpStatus.OK,
        error: null,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  // get report by id
  public async getReportByID(reportId: string): Promise<ApiResponse> {
    try {
      const report = await this.reportRepository.findOne({
        where: { reportId: reportId },
        relations: {
          reportPlatForm: true, // Include any necessary relations like reportPlatForm
        },
      });

      if (report !== null) {
        return {
          message: "Report found",
          data: report, // Return report with SAS URLs
          statusCode: HttpStatus.OK,
        };
      }

      throw new NotFoundException("Report not found");
    } catch (error: any) {
      throw new Error("Failed to fetch report: " + error?.message);
    }
  }

  // delete report by id
  public async archiveOrUnarchiveReportById(reportId: string) {
    try {
      const reportExist = await this.reportRepository.findOne({
        where: { reportId },
      });
      if (reportExist !== null) {
        reportExist.archived = !reportExist.archived;
        const archiveReport = await this.reportRepository.save(reportExist);
        if (archiveReport?.archived === true) {
          return {
            message: "Report has been successfully archived",
            statusCode: HttpStatus.OK,
          };
        } else if (archiveReport.archived === false) {
          return {
            message: "Report has been unarchived successfully",
            statusCode: HttpStatus.OK,
            error: null,
            data: null,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Error occured while archiving report",
            data: null,
            error: "Error occured while archiving report",
          };
        }
      }
      throw new NotFoundException(`Report with ID: ${reportId} not found`);
    } catch (error) {
      throw error;
    }
  }
  // get report by suspect number
  public async getReportBySuspectNumber(
    phoneNumber: string
  ): Promise<ApiResponse> {
    try {
      const report = await this.reportRepository.find({
        where: { suspectNumber: phoneNumber },
      });
      if (report !== null) {
        return {
          statusCode: HttpStatus.OK,
          message: "Reports found",
          data: report,
        };
      }

      throw new HttpException("Report Not found", HttpStatus.NOT_FOUND);
    } catch (error) {
      throw error;
    }
  }
  // get total phoneNumber report
  public async getSuspectTotalReport(
    phoneNumber: string
  ): Promise<ApiResponse> {
    try {
      const suspectExist = await this.reportRepository.find({
        where: { suspectNumber: phoneNumber },
      });
      if (suspectExist.length) {
        return {
          statusCode: HttpStatus.OK,
          message: "Suspect not found",
          data: suspectExist.length,
        };
      }
      throw new HttpException("Suspect not found", HttpStatus.NOT_FOUND);
    } catch (error) {
      throw error;
    }
  }

  public async addReport(
    reporter: string,
    payload: CreateReportDto,
    origin: OriginEnum
  ): Promise<Object> {
    const { platFormId, requestFiles, suspectNumber, ...data } = payload;

    // Check if reporter number is not same as the suspect number
    if (reporter === suspectNumber) {
      throw new BadRequestException(
        `Reporter's number must not be the same as the suspect number`
      );
    }

    try {
      // Parallelizing database calls to avoid to reduce wait time
      const [reportExist, currentThreshold, platForm] = await Promise.all([
        this.reportRepository.findOne({
          where: {
            reporterNumber: "+233201075840",
            suspectNumber: suspectNumber,
            reportPlatFormId: platFormId,
          },
          relations: {
            reportPlatForm: true,
          },
        }),
        this.reportThresholdRepository.findOne({
          where: { name: "reportThreshold" },
        }),
        this.reportPlatformRepository.findOne({
          where: { id: platFormId },
        }),
      ]);

      if (reportExist) {
        return {
          message:
            "You cannot report the same number twice on the same platform",
          statusCode: HttpStatus.OK,
          data: {
            suspectNumber: suspectNumber,
            reportedOn: reportExist.createdAt,
            platform: reportExist.reportPlatForm.displayName,
          },
        };
      }

      // Create new report
      const report = this.reportRepository.create({
        reporterNumber: "+233201075840",
        description: data.description,
        suspectNumber: suspectNumber,
        incidentDate: data.incidentDate,
        reportPlatFormId: platFormId,
      });
      report.reportPlatForm = platForm;

      const savedReport = await this.reportRepository.save(report);

      // Associate Report with Fraud Number
      let fraudNumberExist = await this.fraudNumberRepository.findOne({
        where: { fraudNumber: payload.suspectNumber },
      });

      if (!fraudNumberExist) {
        const newFraudNumber = this.fraudNumberRepository.create({
          fraudNumber: payload.suspectNumber,
          reports: [],
          reported: true,
        });
        newFraudNumber.reports.push(savedReport);
        await this.fraudNumberRepository.save(newFraudNumber);
      } else {
        // Using QueryBuilder to avoid loading all reports
        await this.fraudNumberRepository
          .createQueryBuilder()
          .relation(FraudNumberEntity, "reports")
          .of(fraudNumberExist)
          .add(savedReport);
      }

      // Checking Report Count against Threshold
      const reportCount = await this.reportRepository.count();
      if (reportCount >= currentThreshold.reportCount) {
        await this.caseFileService.createCaseFile({
          suspectNumber: savedReport.suspectNumber,
        });
      }

      // File Upload
      if (requestFiles && requestFiles.length > 0) {
        this.uploadFilesQueue.add("uploadReportFiles", {
          reportId: savedReport.reportId,
          files: payload.requestFiles,
        });
      }

      // Initialize notify me
      await this.sendMessageQueue.add("sendMessage", { suspectNumber });
      await this.sendMessageQueue.add("sendEmail", { suspectNumber });
      const originPayload = {
        modelName: ModelNameEnum.Report,
        origin,
        suspectNumber,
      };
      await this.createOrigin.add("createOrigin", { ...originPayload });
      await this.fraudNumberService.calculateRiskLevel(suspectNumber);

      return {
        message: "Report created successfully",
        statusCode: HttpStatus.CREATED,
        error: null,
        data: report,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  public async createBackOfficeReport(
    userRole: string,
    payload: CreateBackOfficeReportDto
  ): Promise<any> {
    try {
      // Authorization Check
      if (!this.hasPermission(userRole, "admin")) {
        throw new UnauthorizedException(
          "Unauthorized only admins are allowed to create reports from back office"
        );
      }
      const currentThreshold = await this.reportThresholdRepository.findOne({
        where: { name: Not("") },
      });

      if (!currentThreshold)
        throw new BadRequestException("No existing threshold found");

      const { platFormId, requestFiles, ...data } = payload;
      const platForm = await this.reportPlatformRepository.findOne({
        where: { id: platFormId },
      });

      if (!platForm) {
        throw new BadRequestException(
          `Report platform not found: ${platFormId}`
        );
      }

      // Create new report
      const newReport = this.reportRepository.create(data);
      newReport.reportPlatForm = platForm;
      newReport.reportPlatFormId = platFormId;
      const savedReport = await this.reportRepository.save(newReport);

      // Associate Report with Fraud Number
      const fraudNumberExist = await this.fraudNumberRepository.findOne({
        where: { fraudNumber: payload.suspectNumber },
      });

      if (!fraudNumberExist) {
        const newFraudNumber = this.fraudNumberRepository.create({
          fraudNumber: payload.suspectNumber,
          reported: true,
          reports: [savedReport],
        });
        await this.fraudNumberRepository.save(newFraudNumber);
      } else {
        fraudNumberExist.reports.push(savedReport);
        await this.fraudNumberRepository.save(fraudNumberExist);
      }

      // File Upload
      if (requestFiles && requestFiles.length > 0) {
        this.uploadFilesQueue.add("uploadReportFiles", {
          reportId: savedReport.reportId,
          files: payload.requestFiles,
        });
      }

      // Checking Report Count against Threshold
      const existingReports = await this.reportRepository.find();

      if (existingReports?.length === currentThreshold?.reportCount) {
        // Create Case File
        await this.caseFileService.createCaseFile({
          suspectNumber: savedReport.suspectNumber,
        });
      }
      await this.sendMessageQueue.add("sendMessage", data?.suspectNumber);

      // Return Response
      return {
        message: "Report created successfully",
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.logger.error(`Error occurred during operation: ${error}`);
      this.handleDatabaseError(error);
    }
  }

  // Helper method to check if a role has a specific permission
  private hasPermission(role: string, targetRoleName: string): boolean {
    return role === targetRoleName;
  }

  public async getReportStatistics(): Promise<ApiResponse> {
    try {
      const reports = await this.reportRepository.find({
        relations: ["reportPlatForm"],
      });

      const reportCountByPlatform = Report.getReportCountByPlatform(reports);
      const totalReports = Report.getTotalReports(reports);

      return {
        statusCode: HttpStatus.OK,
        message: "Report statistics fetched successfully",
        data: {
          reportCountByPlatform,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
