import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../authentication/guards/jwt-auth.guard";
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import {
  CreateBackOfficeReportDto,
  CreateReportDto,
} from "../dto/create.report.dto";
import { ReportService } from "../service/report.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateReportGuard } from "../guard/create-report.guard";
import { GetReporterNumber } from "../../authorization/current-user.decorator";

import { GetCurrentUser } from "src/authorization/decorators/current-user.decorator";
import { RoleGuard } from "src/authentication/guards/role.guard";
import { Roles } from "src/authorization/decorators/role.decorator";
import { ApiResponse } from "src/sms/type/api-response";
import { OriginEnum } from "src/shared/enums/origin.enum";
import { JwtPayload } from "src/authentication/dtos/jwt.payload";
import { decryptText } from "utils/encryption/encryption";
import { IsPhoneNumber, validate, ValidationError } from "class-validator";

// Define a simple DTO class to validate suspectNumber
class SuspectNumberDto {
  @IsPhoneNumber()
  suspectNumber: string;
}

@ApiTags("Report")
@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // create new report

  @UseGuards(CreateReportGuard)
  @UseInterceptors(
    FilesInterceptor("requestFiles", 5, {
      limits: {
        fileSize: 10000000, // 10MB for all files
      },
      fileFilter: (req, file, callback) => {
        // Allowed MIME types for images, videos, audio files, PDFs, and Word documents
        const allowedMimes = [
          "image/jpeg", // for .jpeg and .jpg
          "image/png", // for .png
          "video/mp4", // for .mp4
          "video/x-msvideo", // for .avi
          "audio/mpeg", // for .mp3
          "audio/wav", // for .wav
          "audio/aac", // for .aac
          "application/pdf", // for .pdf
          "application/msword", // for .doc
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // for .docx
        ];

        // Check if the file's MIME type is in the allowed list
        if (!allowedMimes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              "Invalid file type. Only JPEG, PNG, MP4, AVI, MP3, WAV, AAC, PDF, DOC, and DOCX files are allowed."
            ),
            false
          );
        }

        // Additional size check for video files to ensure they do not exceed 10MB
        if (
          [
            "video/mp4",
            "video/x-msvideo",
            "audio/mpeg",
            "audio/wav",
            "audio/aac",
          ].includes(file.mimetype) &&
          file.size > 10000000
        ) {
          return callback(
            new BadRequestException(
              "Video and Audio files should not exceed 10MB."
            ),
            false
          );
        }

        // Accept the file if it meets all criteria
        callback(null, true);
      },
    })
  )
  @Post()
  @ApiBody({ type: CreateReportDto })
  @ApiQuery({ name: "origin", enum: OriginEnum })
  @ApiConsumes("multipart/form-data")
  async createReport(
    @GetReporterNumber("userName") reporter: string,
    @Body() reportDto: CreateReportDto,
    @UploadedFiles() requestFiles: Express.Multer.File[],
    @Query("origin") origin: OriginEnum
  ) {
    // Encrypt each file's content

    // if (reportDto?.suspectNumber)
    //   reportDto.suspectNumber = decryptText(reportDto?.suspectNumber);

    // Decrypt suspectNumber and description
    if (reportDto?.suspectNumber) {
      reportDto.suspectNumber = decryptText(reportDto?.suspectNumber);

      // Validate the decrypted suspectNumber
      const suspectNumberDto = new SuspectNumberDto();
      suspectNumberDto.suspectNumber = reportDto.suspectNumber;
      const validationErrors: ValidationError[] = await validate(
        suspectNumberDto
      );
      // Check if there are validation errors
      if (validationErrors.length > 0) {
        throw new BadRequestException("Suspect number is invalid.");
      }
    }

    if (reportDto?.description)
      reportDto.description = decryptText(reportDto?.description);
    const payload = {
      ...reportDto,
      requestFiles,
    };

    return await this.reportService.addReport(reporter, payload, origin);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin", "super_user")
  @Post("back-office")
  @ApiConsumes("multipart/form-data")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor("requestFiles", 5))
  @ApiBody({ type: CreateBackOfficeReportDto })
  async createReportBackOffice(
    @GetCurrentUser() currentUser: JwtPayload,
    @Body() reportDto: CreateBackOfficeReportDto,
    @UploadedFiles() requestFiles: Express.Multer.File[]
  ) {
    const payload = {
      ...reportDto,
      requestFiles,
    };
    return await this.reportService.createBackOfficeReport(
      currentUser?.role,
      payload
    );
  }

  //get all reports

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin", "super_user")
  @Get()
  async getReports(): Promise<ApiResponse> {
    return await this.reportService.getReports();
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin", "super_user")
  @Get("archived")
  async getArchivedReports(): Promise<ApiResponse> {
    return await this.reportService.getArchivedReports();
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin", "super_user")
  @Get(":reportId")
  @ApiParam({ name: "reportId", type: "string" })
  public async getReportByID(
    @Param("reportId") reportId: string
  ): Promise<Object> {
    return await this.reportService.getReportByID(reportId);
  }

  // get all reports for suspect by phone

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin", "super_user")
  @Get("suspect/phone-number/:phoneNumber")
  @UseGuards(JwtAuthGuard)
  public async getAllReportForSuspectByPhone(
    @Param("phoneNumber") phoneNumber: string
  ) {
    return await this.reportService.getReportBySuspectNumber(phoneNumber);
  }

  // remove report

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("admin", "super_user")
  @Patch(":reportId/archive")
  public async removeReportById(
    @Param("reportId", new ParseUUIDPipe()) reportId: string
  ) {
    return await this.reportService.archiveOrUnarchiveReportById(reportId);
  }

  @Get("fraud-numbers/statistics")
  async getReportStatistics() {
    return await this.reportService.getReportStatistics();
  }
}
