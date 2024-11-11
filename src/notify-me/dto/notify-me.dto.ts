import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";

export class CreateSubscriptionDto {
  
  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: "string",
    format: "phone",
    example: "+1234567890"
  })
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    type: "string",
    format: "email",
  })
  email?: string;
}

export class RemoveSubscriberDto {
  @IsPhoneNumber()
  @ApiProperty({
    type: "string",
    format: "phone",
  })
  phoneNumber?: string;

  @IsEmail()
  @ApiPropertyOptional({
    type: "string",
    format: "email",
  })
  email?: string;

}

