import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
} from "class-validator";


export class CreateReportDto {

  @ApiProperty({ type: "string", example: "+1234567890" })
  @IsNotEmpty()
  suspectNumber: string;

  @ApiProperty({
    type: "string",
    format: "uuid",
    nullable: false,
  })
  @IsNotEmpty()
  @IsUUID()
  platFormId: string;

  @ApiPropertyOptional({ type: "string" })
  description: string;

  @ApiProperty({
    description: "Array of request files",
    type: "string",
    isArray: true,
    format: "binary",
    nullable: false,
  })
  requestFiles: Express.Multer.File[]

  @ApiProperty({ type: "string", format: "date", example: "2017-07-21" })
  @IsDate()
  incidentDate: Date;
}

export class CreateBackOfficeReportDto {
  @IsNotEmpty()
  @ApiProperty({ type: "string", format: "phone", example: "+1234567890" })
  @IsPhoneNumber()
  reporterNumber: string;

  @IsNotEmpty()
  @ApiProperty({ type: "string", example: "+1234567890" })
  // @IsPhoneNumber()
  suspectNumber: string;

  @ApiProperty({
    type: "string",
    format: "uuid",
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  platFormId: string;

  @IsOptional()
  @ApiPropertyOptional({ type: "string" })
  description: string;

  @ApiProperty({
    description: "Array of request files",
    type: "string",
    isArray: true,
    format: "binary",
    required: true,
  })
  requestFiles: Express.Multer.File[];

  @IsNotEmpty()
  @ApiProperty({ type: "date", format: "date", example: "10-2-2022" })
  incidentDate: Date;
}
