import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  BadRequestException,
  UploadedFile,
} from "@nestjs/common";

import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/authorization/decorators/role.decorator";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Users")
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles("admin")
  @UseInterceptors(
    FileInterceptor("avatarUrl", {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB in bytes
      },
      fileFilter: (req, file, callback) => {
        // Allowed MIME types for images
        const allowedMimes = ["image/jpeg", "image/png"];

        // Check if the file's MIME type is in the allowed list
        if (!allowedMimes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              "Invalid file type. Only JPEG and PNG files are allowed."
            ),
            false
          );
        }

        // Accept the file if it meets all criteria
        callback(null, true);
      },
    })
  )
  @ApiConsumes("multipart/form-data")
  @Post()
  async createUser(
    @Body() userData: CreateUserDto,
    @UploadedFile() avatarUrl?: Express.Multer.File // Handle single file upload
  ) {
    const payload = {
      ...userData,
      avatarUrl,
    };
    return await this.userService.createUser(payload);
  }

  @Get(":id")
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserById(@Param("id", new ParseUUIDPipe()) userId: string) {
    return await this.userService.getUserById(userId);
  }

  @Roles("admin")
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Roles("admin")
  @Put(":id")
  @UseInterceptors(
    FileInterceptor("avatarUrl", {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB in bytes
      },
      fileFilter: (req, file, callback) => {
        // Allowed MIME types for images
        const allowedMimes = ["image/jpeg", "image/png"];

        // Check if the file's MIME type is in the allowed list
        if (!allowedMimes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              "Invalid file type. Only JPEG and PNG files are allowed."
            ),
            false
          );
        }

        // Accept the file if it meets all criteria
        callback(null, true);
      },
    })
  )
  @ApiBody({ type: UpdateUserDto })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUser(
    @Param("id", new ParseUUIDPipe()) userId: string,
    @Body() updatedUserData: UpdateUserDto,
    @UploadedFile() avatarUrl?: Express.Multer.File
  ) {
    const payload = {
      ...updatedUserData,
      avatarUrl,
    };

    return await this.userService.updateUser(userId, payload);
  }

  @Roles("admin")
  @Delete(":id")
  async deleteUser(@Param("id", new ParseUUIDPipe()) userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
