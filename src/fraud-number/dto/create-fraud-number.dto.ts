import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateFraudNumberDto {
  @ApiPropertyOptional({
    type: "boolean",
    default: false,
  })
  visibility?: boolean;

  @ApiPropertyOptional({
    type: "boolean",
    default: false,
  })
  reported?: boolean;

  @ApiPropertyOptional({
    type: "boolean",
    default: false,
  })
  investigated?: boolean;

  @ApiPropertyOptional({
    type: "boolean",
    default: false,
  })
  approved?: boolean;
}
