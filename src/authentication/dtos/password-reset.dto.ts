import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ResetUserPasswordDto {
    @IsNotEmpty()
    @ApiProperty({ type: 'string', description: 'The Email of the user', required: true})
    email: string;
}