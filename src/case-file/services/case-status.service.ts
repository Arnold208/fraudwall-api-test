import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { Actions } from "src/shared/actions/actions";
import { CaseFileStatus } from "../entities/case-status.entity";
import {
  AddCaseFileStatusDto,
  UpdateCaseFileStatusDto,
} from "../dto/case-file-status/create.case-file-status.dto";
import { Role } from "src/user/entities/role.entity";
import User from "src/user/entities/user.entity";
import { ApiResponse } from "src/sms/type/api-response";

@Injectable()
export class CaseFileStatusService {
  constructor(
    @InjectRepository(CaseFileStatus)
    private readonly caseFileStatusRepository: Repository<CaseFileStatus>
  ) {}

  private handleDatabaseError(error: any): void {
    switch (error?.code) {
      case "23502":
        throw new BadRequestException(
          "Not null violation: Please provide all required fields."
        );
      case "23503":
        throw new BadRequestException(
          "Foreign key violation: The referenced record does not exist."
        );
      case "23505":
        throw new ConflictException(
          "Unique violation: The provided data violates a unique constraint."
        );
      case "42703":
        throw new BadRequestException(
          "Undefined column: A provided column does not exist in the table."
        );
      default:
        throw error;
    }
  }

  // Helper method to check if a role has a specific permission
  private hasPermission(role: Role, targetRoleName: string): boolean {
    return role.roleName === targetRoleName;
  }

  // Helper method to check admin permission based on statusId or action
  private checkAdminPermission(action: string, role: Role): void {
    const isAdmin = this.hasPermission(role, "admin");

    switch (action.toLowerCase().trim()) {
      case "addCaseFileStatus":
        if (!isAdmin) {
          throw new UnauthorizedException(
            "Unauthorized: Only admins can add case file status."
          );
        }
        break;
      case "updateCaseStatus":
        if (!isAdmin) {
          throw new UnauthorizedException(
            "Unauthorized: Only admins can remove case file status."
          );
        }
        break;
      case "updateCaseFileStatus":
        if (!isAdmin) {
          throw new UnauthorizedException(
            "Unauthorized: Only admins can update case file status."
          );
        }
        break;
      default:
        break;
    }
  }

  // add case status
  public async addCaseFileStatus(
    user: User,
    caseStatusData: AddCaseFileStatusDto
  ): Promise<object> {
    const userRoles = user?.role;

    let { name, description } = caseStatusData;
    name = name.trim().toLowerCase();

    try {
      this.checkAdminPermission(Actions.addCaseFileStatus, userRoles);

      const statusExist = await this.caseFileStatusRepository.findOne({
        where: { name },
      });

      if (statusExist) {
        throw new ConflictException(`Status name: ${name} already exists`);
      }

      const newStatus = new CaseFileStatus();
      newStatus.name = name;
      newStatus.description = description;

      await this.caseFileStatusRepository.save(newStatus);

      return {
        message: "CaseFileStatus added successfully",
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  public async updateCaseFileStatus(
    statusId: string,
    user: User,
    caseStatusData: UpdateCaseFileStatusDto
  ): Promise<object> {
    const userRoles = user?.role;

    let { name, description } = caseStatusData;
    name = name.trim().toLowerCase();
    try {
      this.checkAdminPermission(Actions.updateCaseFileStatus, userRoles);
      const statusExist = await this.caseFileStatusRepository.findOne({
        where: { statusId },
      });
      if (!statusExist) {
        throw new NotFoundException(`Status: ${statusId} not found`);
      }
      if (name !== undefined && statusExist?.name === name) {
        throw new ConflictException(`Status name: ${name} already exists`);
      } else if (name !== undefined) {
        statusExist.name = name.trim().toLowerCase();
      }

      if (description) statusExist.description = description;
      await this.caseFileStatusRepository.save(statusExist);
      return {
        message: "CaseFileStatus updated successfully",
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async removeCaseFileStatus(statusId: string, user: User): Promise<object> {
    const userRoles = user?.role;

    try {
      this.checkAdminPermission(Actions.removeCaseFileStatus, userRoles);

      const deleteResult = await this.caseFileStatusRepository.delete(statusId);

      if (deleteResult.affected === 0) {
        throw new NotFoundException(
          `CaseFileStatus with ID: ${statusId} not found`
        );
      }

      return {
        message: "CaseFileStatus removed successfully",
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async getCaseFileStatus(statusId: string): Promise<ApiResponse> {
    try {
      const caseFileStatus = await this.caseFileStatusRepository.findOne({
        where: { statusId },
      });
      if (caseFileStatus) {
        return {
          message: "Case file status found",
          statusCode: HttpStatus.OK,
          data: caseFileStatus,
        };
      }

      throw new NotFoundException(`Status Id:${statusId} not found`);
    } catch (error) {
      throw error;
    }
  }

  //get all case file statuses
  async getCaseFileStatuses(): Promise<ApiResponse> {
    try {
      const result = await this.caseFileStatusRepository.find({});
      return {
        message: "Case file statuses found",
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }
}
