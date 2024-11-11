import { IsNotEmpty, IsPhoneNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PhoneNumberDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: "string",
    format: "phone",
    example: "+1234567890",
  })
  phoneNumber: string;
}
