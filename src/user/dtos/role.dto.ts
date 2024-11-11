import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
export class CreateRoleDto {
  @IsNotEmpty({message: "Role name is required"})
  @ApiProperty({ type: "string", description: "Name of role", required: true })
  roleName: string;


  @IsOptional()
  @ApiProperty({ type: "string", description: "Display Name", required:false})
  displayName:string

  @IsOptional()
  @ApiProperty({
    type: "string",
    description: "Description of role",
    required: true,
  })
  description: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
