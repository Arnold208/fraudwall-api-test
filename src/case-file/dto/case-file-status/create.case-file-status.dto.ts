import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddCaseFileStatusDto {
  @ApiProperty({
    type: "string",
    description: "Name of the status",
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: "string",
    description: "Description of the status",
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateCaseFileStatusDto extends PartialType(
  AddCaseFileStatusDto
) {}
