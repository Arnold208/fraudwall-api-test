import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { compare, hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from "src/user/entities/user.entity";
import { JwtPayload } from "../dtos/jwt.payload";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "../dtos/login.dto";
import {
  ChangeCurrentPasswordDto,
  UpdatePasswordDto,
} from "../dtos/change-password.dto";
import { ResetUserPasswordDto } from "../dtos/password-reset.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly apiKeys: string[] = [process.env.API_KEY];
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  //validate api keys
  async validateApiKey(apiKey: string): Promise<boolean> {
    return this.apiKeys.includes(apiKey);
  }
  //validate user
  async validateUserCredentials(
    email: string,
    password: string
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: { role: true },
      });
      if (!user) {
        throw new UnauthorizedException("Invalid user credentials");
      }
      const validPassword = await compare(password, user.password);
      if (!validPassword) {
        throw new UnauthorizedException("Invalid user credentials");
      }
      return user;
    } catch (error: any) {
      this.logger.error(
        `Failed to validate user ${JSON.stringify(error?.message)}`
      );
      throw error;
    }
  }

  async validateUserJwt(payload: JwtPayload): Promise<User> {
    try {
      const { sub } = payload;
      return await this.userRepository.findOne({
        where: { userId: sub },
        relations: { role: true },
      });
    } catch (error) {
      throw error;
    }
  }

  //login user
  async loginUser(userData: LoginUserDto): Promise<object> {
    try {
      const user = await this.validateUserCredentials(
        userData.email,
        userData.password
      );

      if (!user) {
        this.logger.error("Validation Error");
        throw new UnauthorizedException("Invalid user credentials");
      }

      const userInfo = await this.userRepository.findOne({
        where: { email: userData.email },
        relations: {
          role: true,
        },
      });
      if (!userInfo) {
        throw new BadRequestException(`Invalid user credentials`);
      }

      const role = userInfo?.role;
      const roleName = role?.roleName;

      const payload: JwtPayload = {
        sub: user.userId,
        email: user.email,
        avatar: user?.avatarUrl,
        role: roleName,
      };

      //create user token
      const token = await this.generateJwtToken(payload);
      const refreshToken = await this.generateRfreshToken(payload);

      if (token) {
        var result = {
          data: {
            accessToken: token,
            refreshToken,
          },
          status: HttpStatus.CREATED,
          message: "Login successfull",
        };
        return result;
      }

      this.logger.log("Login failed");
      throw new BadRequestException("Login failed");
    } catch (error: any) {
      this.logger.error(`Error occured while trying to login user: ${error}`);
      if (error.code === "23502") {
        // Handle not_null_violation error (e.g., a required field is missing)
        throw new BadRequestException(
          "Not null violation: Please provide all required fields."
        );
      } else if (error?.code === "23503") {
        // Handle foreign_key_violation error (e.g., referencing a non-existent record)
        throw new BadRequestException(
          "Foreign key violation: The referenced record does not exist."
        );
      } else if (error?.code === "42703") {
        // Handle undefined_column error (e.g., column name does not exist)
        throw new BadRequestException(
          "Undefined column: A provided column does not exist in the table."
        );
      } else if (error?.code === "42P01") {
        throw new InternalServerErrorException(
          "Undefined table column, table does not exist"
        );
      } else {
        // For any other error, rethrow the original error
        throw error;
      }
    }
  }

  async initializeBackOfficePasswordChange(user: User): Promise<string> {
    try {
      const userExist = await this.userRepository.findOne({
        where: { userId: user?.userId },
      });
      if (!userExist)
        throw new NotFoundException(`User ${user} does not exist`);
      const resetToken = uuidv4();
      const resetUrl = `${process.env.APP_HOST}/api/v1/auth/password-reset/${resetToken}`;
      userExist.resetToken = resetToken;
      await this.userRepository.save(userExist);
      return resetUrl;
    } catch (error) {
      this.logger.log("Error occured while creating password reset token");
      throw error;
    }
  }

  async resetPasswordToken(
    resetPasswordData: ResetUserPasswordDto
  ): Promise<object> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: resetPasswordData.email },
      });
      if (!user) {
        return;
      }
      const resetToken = uuidv4();
      // const _resetUrl = `${process.env.APP_HOST}/api/v1/auth/password-reset/${resetToken}`;

      user.resetToken = resetToken;
      await this.userRepository.save(user);
      return {
        message: "Password Reset Successfully",
        status: HttpStatus.CREATED,
        error: null,
      };
    } catch (error) {
      this.logger.error(`Failed to generate password reset token`);
      throw error;
    }
  }

  public async updatePassword(
    resetToken: string,
    updatePasswordData: UpdatePasswordDto
  ): Promise<object> {
    try {
      const { newPassword } = updatePasswordData;
      if (!newPassword) throw new BadRequestException("Password is required");
      this.logger.log("Checking if User Reset Password Token Is Valid");
      const user = await this.userRepository.findOne({
        where: { resetToken },
      });
      if (!user) {
        this.logger.log("User Reset Password Token Invalid");
        throw new BadRequestException(`User Reset Password Token Invalid`);
      }

      user.password = await hash(newPassword, 8);
      const result = await this.userRepository.save(user);
      if (result) {
        this.logger.log("User Password Reset Successfully Updated");
        return {
          message: "User password successfully updated",
          statusCode: HttpStatus.NO_CONTENT,
          error: null,
        };
      }
      throw new BadRequestException(`User password reset failed`);
    } catch (error: any) {
      this.logger.log(
        `User password reset failed ${JSON.stringify(error?.message)}`
      );
      throw error;
    }
  }

  async verifyResetToken(token: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { resetToken: token },
      });
    } catch (error) {
      throw error;
    }
  }

  public async changeCurrentPassword(
    user: JwtPayload,
    changeCurrentPasswordData: ChangeCurrentPasswordDto
  ): Promise<object> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { userId:user?.sub },
      });
      if (!existingUser) {
        this.logger.log("User not found");
        throw new NotFoundException("User not found");
      }

      if (existingUser.email !== user.email) {
        this.logger.log("Invalid user credentials/current user does not match existing user in database");
        throw new UnauthorizedException(
          "Wrong user credenttials provided"
        );
      }

      const validatePassword = await compare(
        changeCurrentPasswordData.currentPassword,
        existingUser.password
      );
      if (!validatePassword) {
        this.logger.log("Invalid Password");
        throw new BadRequestException("Invalid Password");
      }

      existingUser.password = await hash(
        changeCurrentPasswordData.newPassword,
        10
      );
      await this.userRepository.save(existingUser);

      this.logger.log("User password successfully updated");
      return {
        message: "User password successfully updated",
        statusCode: HttpStatus.OK,
        error: null,
      };
    } catch (error: any) {
      this.logger.log(
        `User password change failed ${JSON.stringify(error?.message)}`
      );
      throw error;
    }
  }

  async getNewRefreshTokenAndAccessToken(userId: string, refreshToken: string) {
    try {
      this.logger.log(`Checking if refresh token and user exist`);
      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user || !user.refreshToken)
        throw new ForbiddenException("Access denied!");

      this.logger.log("Verifying refresh token");
      const token: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        }
      );

      // throw forbidden exception if token is not valid
      if (!token) throw new ForbiddenException("Access denied!");

      //Generate the refresh token
      this.logger.log(`Generating new refresh token`);
      const newRfreshToken = await this.generateRfreshToken(token);
      return {
        data: {
          accessToken: await this.generateJwtToken(token),
          refreshToken: newRfreshToken,
        },
        statusCode: HttpStatus.CREATED,
        message: "Refresh token generated",
      };
    } catch (error) {
      this.logger.error(`Error saving refresh token: ${error}`);
      throw error;
    }
  }

  async generateJwtToken(userInfo: JwtPayload): Promise<string> {
    try {
      this.logger.log("Creating JWT token");
      const payload: JwtPayload = {
        email: userInfo.email,
        sub: userInfo.sub,
        avatar: userInfo.avatar,
        role: userInfo.role,
      };
      const token = await this.jwtService.signAsync(payload);
      if (token !== null) {
        this.logger.log("Jwt token created");
        return token;
      }
      throw new BadRequestException(
        `Error generating JWT token: ${JSON.stringify(token)}`
      );
    } catch (error: any) {
      this.logger.error(error?.message);
      throw error;
    }
  }

  async generateRfreshToken(userInfo: JwtPayload): Promise<string> {
    try {
      this.logger.log("Creating refresh token");
      const payload: JwtPayload = {
        email: userInfo.email,
        sub: userInfo.sub,
        avatar: userInfo.avatar,
        role: userInfo.role,
      };
      const user = await this.userRepository.findOne({
        where: { userId: userInfo.sub },
      });
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: +process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME,
      });
      if (token !== null) {
        user.refreshToken = token;
        await this.userRepository.update(userInfo.sub, { refreshToken: token });
        this.logger.log("Refresh token has been created");
        return token;
      }
      throw new BadRequestException(
        `Error generating refresh token: ${JSON.stringify(token)}`
      );
    } catch (error: any) {
      this.logger.error(error?.message);
      throw error;
    }
  }
}
