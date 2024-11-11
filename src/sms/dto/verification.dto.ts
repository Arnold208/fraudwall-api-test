import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class VerificationDTO {
  @IsPhoneNumber()
  @ApiProperty({
    type: "string",
    format: "phone",
    example: "+1234567890",
  })
  @IsNotEmpty()
  readonly reporterNumber: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  readonly code: string;
}
