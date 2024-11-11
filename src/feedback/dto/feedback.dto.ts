import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class FeedbackDto {
  @IsNotEmpty()
  @ApiProperty({
    type: "string",
    required: true,
  })
  firstName?: string;

  @IsNotEmpty()
  @ApiProperty({
    type: "string",
    required: true,
  })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: "string",
    required: true,
    format: "email",
  })
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: "string",
    required: true,
    format: "phone",
    example: "+1234567890",
  })
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty({
    type: "string",
    required: true,
  })
  message: string;
}
