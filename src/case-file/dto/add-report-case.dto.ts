import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsUUID } from "class-validator";

export class AddReportToCaseFileDto {
  @ApiProperty({
    type: "string",
    required: true,
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  public suspectNumber: string;

  @ApiPropertyOptional({
    type: "string",
    required: false,
    format: "uuid",
    description: "Case file status Id",
  })
  @IsUUID()
  @IsOptional()
  statusId?: string;

  @ApiPropertyOptional({
    type: "string",
    required: false,
    description: "Notes on case",
  })
  @IsOptional()
  public remark?: string;
}
