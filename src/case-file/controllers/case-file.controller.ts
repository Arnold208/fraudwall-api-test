import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from "@nestjs/common";
import { ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";

import { CaseFileService } from "../services/case-file.service";
import { AddReportToCaseFileDto } from "../dto/add-report-case.dto";
import { UpdateCaseFileDto } from "../dto/update-case-file.dto";

import { GetCurrentUser } from "src/authorization/decorators/current-user.decorator";
import {
  AddCommentToCaseFileDto,
  UpdateCaseFileCommentDto,
} from "../dto/comment.dto";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { AssignCaseFileDto } from "../dto/assign-case.dto";
import { ActivityLogService } from "src/log/services/activity-log.service";
import { Request } from "express";
import { PhoneNumberDto } from "src/sms/dto/phone-number.dto";
import { ApiResponse } from "src/sms/type/api-response";
import { JwtPayload } from "src/authentication/dtos/jwt.payload";
import { RoleGuard } from "src/authentication/guards/role.guard";
import { Roles } from "src/authorization/decorators/role.decorator";

@UseGuards(JwtAuthGuard)
@ApiTags("Case-Files")
@Controller("case-file")
export class CaseFileController {
  constructor(
    private readonly caseFileService: CaseFileService,
    private readonly activityLogService: ActivityLogService
  ) {}

  // create new case file record

  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Post()
  @ApiBody({ type: AddReportToCaseFileDto })
  public async createCaseFile(
    @Body() caseFileData: AddReportToCaseFileDto,
    @GetCurrentUser() user: JwtPayload,
    @Req() request: Request
  ) {
    const result = await this.caseFileService.createCaseFile(caseFileData);
    if (result?.data) {
      // Get the client's IP address more reliably
      const ipAddress: string = this.getClientIPAddress(request);
      const { data, message } = result;
      const endpointUrl = request?.url;
      const userId = user?.sub;
      const relatedEntityId = data?.caseId;
      const details = message;

      await this.activityLogService.logActivity(
        userId,
        relatedEntityId,
        ipAddress,
        endpointUrl,
        details
      );
    }

    return result;
  }

  // get all case file records
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Get()
  public async getCaseFiles(): Promise<ApiResponse> {
    return await this.caseFileService.getCaseFiles();
  }

  // get case file by id
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RoleGuard)
  @Roles("admin","super_user","investigator")
  @Get(":caseFileId")
  public async getCaseFileById(
    @Param("caseFileId", new ParseUUIDPipe()) caseFileId: string
  ) {
    return await this.caseFileService.getCaseFileById(caseFileId);
  }

  @UseGuards(RoleGuard)
  @Roles("admin","super_user","investigator")
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/investigator/cases/:investigatorId")
  public async getCaseFileByInvestigatorId(
    @Param("investigatorId", new ParseUUIDPipe()) investigatorId: string
  ) {
    return await this.caseFileService.getCaseFileInvestigatorId(investigatorId);
  }

  // get case file by phone number
  @UseGuards(RoleGuard)
  @Roles("admin","super_user","investigator")
  @Get("suspect/:phoneNumber")
  @ApiParam({
    name: "phoneNumber",
    type: "string",
    required: true,
    format: "phone",
    example: "+1234567890",
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public async getCaseFileBySuspectNumber(@Param() payload: PhoneNumberDto) {
    return await this.caseFileService.getCaseFileBySuspectNumber(
      payload?.phoneNumber
    );
  }

  // update case file
  @UseGuards(RoleGuard)
  @Roles("admin","super_user","investigator")
  @Patch(":caseFileId")
  public async updateCaseFile(
    @Param("caseFileId", new ParseUUIDPipe()) caseFileId: string,
    @GetCurrentUser() user: JwtPayload,
    @Body() updateCaseFileDto: UpdateCaseFileDto,
    @Req() request: Request
  ) {
    console.log(`user: ${JSON.stringify(user)}`);

    const result = await this.caseFileService.updateCaseFile(
      caseFileId,
      updateCaseFileDto,
      user
    );
    // Get the client's IP address more reliably
    const ipAddress: string = this.getClientIPAddress(request);
    const { data, message } = result;
    const endpointUrl = request?.url;
    const userId = user?.sub;
    const relatedEntityId = data?.caseId;
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

  // remove case file by Id
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Delete(":caseFileId")
  public async removeCase(
    @Param("caseFileId", new ParseUUIDPipe()) caseFileId: string,
    @GetCurrentUser() user: JwtPayload
  ) {
    const role = user?.role;
    return await this.caseFileService.removeCaseFile(caseFileId, role);
  }

  // get total case file records
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Get()
  public async getTotalCaseFileRecords() {
    return await this.caseFileService.getTotalCaseFileRecords();
  }

  // add comment to case file
  @UseGuards(RoleGuard)
  @Roles("admin","super_user","investigator")
  @Post(":caseId/comment")
  @ApiBody({ type: AddCommentToCaseFileDto })
  public async addComment(
    @Param("caseId", new ParseUUIDPipe()) caseId: string,
    @GetCurrentUser() user: JwtPayload,
    @Body() commentData: AddCommentToCaseFileDto,
    @Req() request: Request
  ) {
    const result = await this.caseFileService.addComment(
      caseId,
      user,
      commentData
    );

    // Get the client's IP address more reliably
    const ipAddress: string = this.getClientIPAddress(request);
    const { data, message } = result;
    const endpointUrl = request?.url;
    const userId = user?.sub;
    const relatedEntityId = data?.caseFile?.caseId;
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

  // update case file comment
  @UseGuards(RoleGuard)
  @Roles("admin","super_user","investigator")
  @Patch("comment/:commentId")
  @ApiParam({ name: "commentId", type: "string" })
  @ApiBody({ type: UpdateCaseFileCommentDto })
  public async updateCaseFileComment(
    @Param("commentId", new ParseUUIDPipe()) commentId: string,
    @GetCurrentUser() user: JwtPayload,
    @Body() updateCommentDto: UpdateCaseFileCommentDto,
    @Req() request: Request
  ) {
    const result = await this.caseFileService.updateCaseFileComment(
      commentId,
      updateCommentDto,
      user
    );

    // Get the client's IP address more reliably
    const ipAddress: string = this.getClientIPAddress(request);
    const { data, message } = result;
    const endpointUrl = request?.url;
    const userId = user?.sub;

    const relatedEntityId = data?.commentId;
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

  // remove comment by id
  @Delete("comment/:commentId")
  @UseGuards(RoleGuard)
  @Roles("admin","super_user","investigator")
  @ApiParam({ name: "commentId", type: "string" })
  public async removeComment(
    @Param("commentId", new ParseUUIDPipe()) commentId: string
  ) {
    return await this.caseFileService.removeComment(commentId);
  }

  // get comments by case file id
  @UseGuards(RoleGuard)
  @Roles("admin","super_user","investigator")
  @Get("comments/:caseFileId")
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiParam({ name: "caseFileId", type: "string" })
  public async getCommentsByCaseId(
    @Param("caseFileId", new ParseUUIDPipe()) caseFileId: string
  ) {
    return await this.caseFileService.getCommentsByCaseId(caseFileId);
  }

  // assign case file to investigator
  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Patch("assign/investigator/:caseFileId")
  @ApiParam({ name: "caseFileId", type: "string" })
  public async assignCaseFileToInvestigator(
    @GetCurrentUser() user: JwtPayload,
    @Param("caseFileId", new ParseUUIDPipe()) caseFileId: string,
    @Body() payload: AssignCaseFileDto
  ) {
    return await this.caseFileService.assignCaseFileToInvestigator(
      user,
      caseFileId,
      payload
    );
  }

  private getClientIPAddress(request: Request): string {
    return Array.isArray(request.headers["x-real-ip"])
      ? request.headers["x-real-ip"][0]
      : request.headers["x-real-ip"] || request.socket.remoteAddress?.[0] || "";
  }
}
