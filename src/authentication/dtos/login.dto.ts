import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: "string",
    format: "email",
    description: "Email address of the user",
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: "string",
    format: "password",
    description: "The Password of the user",
    required: true,
  })
  password: string;
}
