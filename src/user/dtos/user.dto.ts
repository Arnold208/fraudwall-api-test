import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    nullable: false,
    description: "First name of the new user",
    type: "string",
  })
  public firstName: string;

  @ApiProperty({
    nullable: false,
    description: "Last name of the new user",
    type: "string",
  })
  public lastName: string;

  @ApiProperty({
    type: "string",
    required: true,
    description: "Email associated with the user (must be unique)",
  })
  public email: string;

  @ApiProperty({ type: "string", required: true })
  password: string;

  @ApiProperty({
    type: "string",
    required: false,
    description: "Id of role to be assigned to user",
    format: "uuid",
  })
  @IsOptional()
  @IsUUID()
  public roleId: string;

  @ApiProperty({
    type: "string",
    format: "binary", // Specifies that the field is a binary file
    required: false,
    description: "Avatar image file for the user",
  })
  @IsOptional()
  public avatarUrl: any;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ["email"])
) {}
