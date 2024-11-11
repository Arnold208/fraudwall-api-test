import { ApiProperty,} from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class AssignCaseFileDto {
  @ApiProperty({
    type: "string",
    required: true,
    format: "uuid",
    description: "Investigators user Id",
  })
  @IsNotEmpty()
  @IsUUID()
  public investigatorId: string;
}
