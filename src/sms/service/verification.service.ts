import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { VerificatonCode } from "utils/generate.token";
import { RedisCacheService } from "../../redis-cache/service/redis-cache.service";
import { VerificationDTO } from "../dto/verification.dto";
import { HubtelService } from "./hubtel.message";

@Injectable()
export class VerificationService {
  constructor(
    private readonly cacheManager: RedisCacheService,
    private readonly hubtelService: HubtelService,
    private jwtService: JwtService
  ) {}

  // generate verifcation code
  async sendVerificationCode(reporterNumber: string): Promise<any> {
    try {
      if (reporterNumber) {
        const verificationCode = await VerificatonCode.generate();
        if (verificationCode != undefined) {
          // send token
          const tokenSent = await this.hubtelService.sendSmsToken(
            reporterNumber,
            verificationCode
          );

          if (tokenSent) {
            await this.cacheManager.setKey(
              reporterNumber,
              verificationCode
            );
            return "Token sent";
          }
          throw new HttpException(
            "An error occured please try again",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
        throw new HttpException(
          "An error occured please try again",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException(
        `Verification number required`,
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      throw error;
    }
  }

  // verify verification code
  async verifyVerificationCode(verificatoionData: VerificationDTO) {
    try {
      if (verificatoionData) {
        // check if reporter has verification code from redis store
        const fetchCodeFromRedisStore = await this.cacheManager.getKey(
          verificatoionData.reporterNumber
        );
        if (fetchCodeFromRedisStore) {
          if (fetchCodeFromRedisStore === verificatoionData.code) {
            const accessToken = this.jwtService.sign({
              userName: verificatoionData?.reporterNumber,
              verify: true,
            });
            return {
              accessToken,
            };
          }
          throw new HttpException(`Invalid code`, HttpStatus.UNAUTHORIZED);
        }
        throw new HttpException(`Invalid credentials`, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(`Payload required`, HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw error;
    }
  }
}
