import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateRiskLevelDto {
  @ApiProperty({ type: "string", required: true })
  name: string;

  @ApiProperty({ type: "integer", required: false, default: 0 })
  reportCount: number;

  @ApiProperty({ type: "string", required: false })
  displayName: string;

  @ApiProperty({ type: "string", required: false })
  description: string;
}

export class UpdateRiskLevelDto extends PartialType(CreateRiskLevelDto) {}
