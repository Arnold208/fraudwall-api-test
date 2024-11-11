import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateLogTypeDto {
  @ApiProperty({
    type: "string",
    required: true,
    description: "Name of the activity log type",
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: "string",
    required: true,
    description: "Name of the activity log type",
  })
  @IsNotEmpty()
  description: string;
}

export class UpdateLogTypeDto extends PartialType(CreateLogTypeDto) {}
