import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { OriginEnum } from "../../shared/enums/origin.enum";
import { ModelNameEnum } from "src/shared/enums/model-name.enum";

export class CreateOriginDto {
  @IsNotEmpty({ message: "Model name is required" })
  @ApiProperty({
    type: "enum",
    enum: OriginEnum,
    enumName: "modelName",
    nullable: false,
  })
  modelName: ModelNameEnum;

  @IsNotEmpty({ message: "Origin name is required" })
  @ApiProperty({
    type: "enum",
    enum: OriginEnum,
    nullable: false,
  })
  origin: OriginEnum;

  @IsOptional()
  @ApiProperty({ type: "string", nullable: true })
  suspectNumber?: string;
}
