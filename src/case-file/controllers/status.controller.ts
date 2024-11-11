import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";

import {
  AddCaseFileStatusDto,
  UpdateCaseFileStatusDto,
} from "../dto/case-file-status/create.case-file-status.dto";

import { Roles } from "src/authorization/decorators/role.decorator";
import User from "src/user/entities/user.entity";
import { CaseFileStatusService } from "../services/case-status.service";
import { GetCurrentUser } from "src/authorization/decorators/current-user.decorator";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { ApiResponse } from "src/sms/type/api-response";

@ApiTags("Case Status")
@UseGuards(JwtAuthGuard)
@Controller("case-file-status")
export class CaseFileStatusController {
  constructor(private readonly caseFileStatusService: CaseFileStatusService) {}

  @Roles("admin") // Decorator to specify roles allowed to access the endpoint
  @Post()
  async addCaseFileStatus(
    @GetCurrentUser() user: User,
    @Body() caseStatusData: AddCaseFileStatusDto
  ): Promise<object> {
    return await this.caseFileStatusService.addCaseFileStatus(
      user,
      caseStatusData
    );
  }

  @Roles("admin") // Decorator to specify roles allowed to access the endpoint
  @Put("/:statusId")
  async updateCaseFileStatus(
    @Param("statusId") statusId: string,
    @GetCurrentUser() user: User,
    @Body() caseStatusData: UpdateCaseFileStatusDto
  ): Promise<object> {
    return await this.caseFileStatusService.updateCaseFileStatus(
      statusId,
      user,
      caseStatusData
    );
  }

  @Roles("admin") // Decorator to specify roles allowed to access the endpoint
  @Delete("/:statusId")
  async removeCaseFileStatus(
    @Param("statusId") statusId: string,
    @GetCurrentUser() user: User
  ): Promise<object> {
    return await this.caseFileStatusService.removeCaseFileStatus(
      statusId,
      user
    );
  }

  @Get("/:statusId")
  async getCaseFileStatus(
    @Param("statusId") statusId: string
  ): Promise<ApiResponse> {
    return await this.caseFileStatusService.getCaseFileStatus(statusId);
  }

  @Get()
  async getCaseFileStatuses(): Promise<ApiResponse> {
    return await this.caseFileStatusService.getCaseFileStatuses();
  }
}
