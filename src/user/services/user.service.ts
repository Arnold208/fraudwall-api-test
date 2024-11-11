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

import User from "../entities/user.entity";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { Role } from "../entities/role.entity";
import { hash } from "bcrypt";
import { AzureBlobService } from "src/media/service/azure/azure-file-upload.service";
import { ApiResponse } from "src/sms/type/api-response";

@Injectable()
export class UserService {
  private readonly logger = new Logger("UserService");
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly azureBlobService: AzureBlobService
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

  async createUser(userData: CreateUserDto): Promise<ApiResponse> {
    const { firstName, lastName, roleId, email, password, avatarUrl } =
      userData;
    try {
      const newUser = this.userRepository.create({
        firstName,
        lastName,
        email,
      });
      newUser.password = await hash(password, 8);
      if (roleId) {
        const roleExist = await this.roleRepository.findOne({
          where: { id: roleId },
        });
        if (!roleExist) {
          throw new BadRequestException("Role not found");
        }
        newUser.role = roleExist;
      }

      if (avatarUrl) {
        try {
          // Upload new avatar to Azure Blob Storage
          const uploadedAvatarName = await this.azureBlobService.uploadFile(
            avatarUrl
          );
          const fileUrl =
            this.azureBlobService.getPublicUrl(uploadedAvatarName);
          newUser.avatarUrl = fileUrl;
          this.logger.log(`New avatar uploaded: ${uploadedAvatarName}`);
        } catch (err: any) {
          this.logger.error(`Error uploading new avatar: ${err.message}`);
          throw new BadRequestException("Failed to upload new avatar.");
        }
      }

      await this.userRepository.save(newUser);
      this.logger.log("New user created successfully");
      return {
        message: "User created successfully",
        data: newUser,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.logger.error(`Error occured while creating new user: ${error}`);
      this.handleDatabaseError(error);
    }
  }

  async getUserById(userId: string): Promise<ApiResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          userId,
        },
        relations: {
          role: true,
        },
      });
      if (!user) {
        throw new NotFoundException("User not found.");
      }
      this.logger.log("User found");
      return { message: "User found", data: user, statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error(`Error occured while fetching user by id :${error}`);
      throw error;
    }
  }

  async getUser(userId: string): Promise<ApiResponse> {
    try {
      const result = await this.userRepository.findOne({
        where: {
          userId,
        },
        relations: {
          role: true,
        },
      });
      return {
        message: "User found",
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error occured while fetching user by id :${error}`);
      throw error;
    }
  }

  async getAllUsers(): Promise<ApiResponse> {
    try {
      const result = await this.userRepository.find({
        relations: {
          role: true,
        },
      });
      return {
        message: "Users found",
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error occured while fetching all users: ${error}`);
      throw error;
    }
  }

  async updateUser(
    userId: string,
    updatedUserData: UpdateUserDto
  ): Promise<ApiResponse> {
    try {
      let userToUpdate = await this.userRepository.findOne({
        where: { userId },
        relations: { role: true },
      });

      if (!userToUpdate) {
        throw new NotFoundException("User not found.");
      }

      const { firstName, lastName, avatarUrl, roleId } = updatedUserData;

      // Handle avatar update
      if (avatarUrl && userToUpdate.avatarUrl) {
        try {
          // Delete the old avatar from Azure Blob Storage
          await this.azureBlobService.deleteFile(userToUpdate.avatarUrl);
          this.logger.log(
            `Old avatar ${userToUpdate.avatarUrl} deleted successfully`
          );
        } catch (err: any) {
          this.logger.error(`Error deleting old avatar: ${err.message}`);
        }
      }

      if (avatarUrl) {
        try {
          // Upload new avatar to Azure Blob Storage
          const uploadedAvatarName = await this.azureBlobService.uploadFile(
            avatarUrl
          );
          const fileUrl =
            this.azureBlobService.getPublicUrl(uploadedAvatarName);
          userToUpdate.avatarUrl = fileUrl;
          this.logger.log(`New avatar uploaded: ${uploadedAvatarName}`);
        } catch (err: any) {
          this.logger.error(`Error uploading new avatar: ${err.message}`);
          throw new BadRequestException("Failed to upload new avatar.");
        }
      }

      // Update user properties
      if (firstName) userToUpdate.firstName = firstName;
      if (lastName) userToUpdate.lastName = lastName;

      // Check and update related entities if provided
      if (roleId) {
        const roleExist = await this.roleRepository.findOne({
          where: { id: roleId },
        });
        if (!roleExist) {
          throw new BadRequestException("Roles not found");
        }
        userToUpdate.role = roleExist;
      }

      await this.userRepository.save(userToUpdate);
      this.logger.log("User records updated successfully");
      return {
        message: "User updated",
        data: userToUpdate,
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      this.logger.error(`Error occurred while updating user records: ${error}`);
      this.handleDatabaseError(error);
    }
  }

  async deleteUser(userId: string): Promise<ApiResponse> {
    try {
      const deleteResult = await this.userRepository.delete(userId);

      if (deleteResult.affected === 0) {
        throw new NotFoundException("User not found.");
      }
      this.logger.log("User record has been removed successfully");
      return {
        message: "User removed",
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Error occured while removing user record: ${error}`);
      throw error;
    }
  }
}
