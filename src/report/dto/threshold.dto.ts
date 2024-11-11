import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";

export class CreateReportThresholdDto {
  @ApiProperty({ type: "integer", required: true })
  reportCount: number;

  @ApiProperty({ type: "string", required: false })
  name: string;

  @ApiProperty({ type: "string", required: false })
  description: string;
}

export class UpdateCreateReportThresholdDto extends PartialType(
  OmitType(CreateReportThresholdDto, ["name"])
) {}
