import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateConfigRuleDto {
  @ApiProperty({
    type: "string",
    description: "Configuration key name",
    required: true,
  })
  @IsNotEmpty()
  ruleName: string;

  @ApiProperty({
    type: "string",
    description: "Value of the key",
    required: true,
  })
  @IsNotEmpty()
  value: string | number;
}

export class UpdateConfigRuleDto extends PartialType(CreateConfigRuleDto) {}
