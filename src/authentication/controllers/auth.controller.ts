import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Req,
  Res,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import {
  UpdatePasswordDto,
  ChangeCurrentPasswordDto,
} from "../dtos/change-password.dto";
import { LoginUserDto } from "../dtos/login.dto";
import { ResetUserPasswordDto } from "../dtos/password-reset.dto";

import { Response, Request } from "express";
import { AuthService } from "../service/auth.service";
import { RefreshTokenGuard } from "../guards/refresh-token-guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { GetCurrentUser } from "src/authorization/decorators/current-user.decorator";
import User from "src/user/entities/user.entity";
import { JwtPayload } from "../dtos/jwt.payload";

@ApiTags("Auth")
@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RefreshTokenGuard)
  @Get("refresh/token")
  async refreshTokens(@Req() req: Request) {
    const userId = req.user["sub"];
    const refreshToken = req.user["refreshToken"];
    return await this.authService.getNewRefreshTokenAndAccessToken(
      userId,
      refreshToken
    );
  }

  @Post("user/login")
  public async createUser(@Body() loginData: LoginUserDto) {
    return await this.authService.loginUser(loginData);
  }

  @Post("/user/password-reset")
  public async passwordReset(@Body() resetPasswordData: ResetUserPasswordDto) {
    return await this.authService.resetPasswordToken(resetPasswordData);
  }

  @Post("/user/password-reset/:resetToken")
  public async updatePassword(
    @Body() updatePasswordData: UpdatePasswordDto,
    @Param("resetToken") resetToken: string
  ) {
    try {
      return await this.authService.updatePassword(
        resetToken,
        updatePasswordData
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("/user/change/current-password")
  public async changeCurrentPassword(
    @GetCurrentUser() currentUser: JwtPayload,
    @Body() changePasswordData: ChangeCurrentPasswordDto
  ) {
    return await this.authService.changeCurrentPassword(
      currentUser,
      changePasswordData
    );
  }

  @Get("password-reset/:resetToken")
  async redirectToResetPasswordPage(
    @Param("resetToken") resetToken: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const user = await this.authService.verifyResetToken(resetToken);
      if (user) {
        const userToken = user?.resetToken;
        res.redirect(
          `${process.env.PASSWORD_RESET_URL_BACK_OFFICE}/${userToken}`
        );
      } else {
        res.send("Reset token not found");
      }
    } catch (error) {
      res.send("Error resetting password");
    }
  }
}
