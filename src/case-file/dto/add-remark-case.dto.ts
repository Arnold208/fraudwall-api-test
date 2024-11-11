import { ApiPropertyOptional } from "@nestjs/swagger";

export class AddRemarkToCaseFileDto{
  @ApiPropertyOptional({
    type: 'string'
  })
  public remarks: string
}