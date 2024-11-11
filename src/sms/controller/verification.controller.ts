import {
  Controller,
  Body,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { VerificationDTO } from "../dto/verification.dto";
import { VerificationService } from "../service/verification.service";
import { IsPhoneNumber } from "class-validator";
import { PhoneNumberDto } from "../dto/phone-number.dto";

@ApiTags("Phone Number Verification")
@Controller()
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get("otp/:phoneNumber")
  @IsPhoneNumber()
  @ApiParam({
    name: "phoneNumber",
    type: "string",
    required: true,
    format: "phone",
    example: "+1234567890",
  })
  async sendVerificationCode(@Param() payload: PhoneNumberDto) {
    return await this.verificationService.sendVerificationCode(
      payload.phoneNumber
    );
  }

  @Post("verify/otp")
  @ApiBody({ type: VerificationDTO })
  async verifyVerificationCode(@Body() verificationCode: VerificationDTO) {
    return await this.verificationService.verifyVerificationCode(
      verificationCode
    );
  }
}
