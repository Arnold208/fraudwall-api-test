import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateReportPlatformDto {
  @ApiProperty({ type: 'string', required: true })
  name: string;

  @ApiProperty({ type: 'string', required: false })
  displayName: string;

  @ApiProperty({ type: 'string', required: false })
  description: string;
}

export class UpdateReportPlatformDto extends PartialType(CreateReportPlatformDto) {}
