import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Role } from "../entities/role.entity";
import { CreateRoleDto, UpdateRoleDto } from "../dtos/role.dto";
import { ApiResponse } from "src/sms/type/api-response";

@Injectable()
export class RoleService {
  private readonly logger = new Logger("RoleService");
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
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
        throw new ConflictException("Role name already exist.");
      case "42703":
        throw new BadRequestException(
          "Undefined column: A provided column does not exist in the table."
        );
      default:
        throw error;
    }
  }

  async createRole(roleData: CreateRoleDto): Promise<ApiResponse> {
    const { roleName, description } = roleData;
    try {
      const newRole = this.roleRepository.create({
        roleName,
        description,
      });

      await this.roleRepository.save(newRole);
      this.logger.log("New Role created successfully");
      return {
        message: "Role created!",
        data: newRole,
        statusCode: HttpStatus.CREATED,
        error: null,
      };
    } catch (error) {
      this.logger.error(`Error occured while creating new Role: ${error}`);
      this.handleDatabaseError(error);
    }
  }

  async getRoleById(roleId: string): Promise<ApiResponse> {
    try {
      const role = await this.roleRepository.findOne({
        where: {
          id: roleId,
        },
        relations: { users: true },
      });
      if (!role) {
        throw new NotFoundException("Role not found.");
      }
      this.logger.log("Role found");
      return {
        message: "Role found",
        statusCode: HttpStatus.OK,
        data: role,
      };
    } catch (error) {
      this.logger.error(`Error occured while fetching Role by id :${error}`);
      throw error;
    }
  }

  async getAllRoles(): Promise<ApiResponse> {
    try {
      const result = await this.roleRepository.find({});
      return {
        message: "Roles found",
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error occured while fetching all Roles: ${error}`);
      throw error;
    }
  }

  async updateRole(
    roleId: string,
    updatedRoleData: UpdateRoleDto
  ): Promise<Object> {
    try {
      let roleToUpdate = await this.roleRepository.findOne({
        where: { id: roleId },
      });

      if (!roleToUpdate) {
        throw new NotFoundException("Role not found.");
      }

      // Update Role properties based on provided data in updatedRoleData
      const { roleName, description } = updatedRoleData;

      if (roleName) roleToUpdate.roleName = roleName;
      if (description) roleToUpdate.description = description;

      await this.roleRepository.save(roleToUpdate);
      this.logger.log("Role records updated successfully");
      return {
        message: "Role updated",
        data: roleToUpdate,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.logger.error(`Error occured while updating Role records: ${error}`);
      this.handleDatabaseError(error);
    }
  }

  async deleteRole(roleId: string): Promise<Object> {
    try {
      const deleteResult = await this.roleRepository.delete(roleId);

      if (deleteResult.affected === 0) {
        throw new NotFoundException("Role not found.");
      }
      this.logger.log("Role record has been removed successfully");
      return {
        message: "Role removed successfully",
        data: null,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Error occured while removing Role record: ${error}`);
      throw error;
    }
  }
}
