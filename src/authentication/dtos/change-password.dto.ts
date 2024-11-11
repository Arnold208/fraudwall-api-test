import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty()
    @ApiProperty({ type: 'string', description: 'User New Password', required: true})
    newPassword:string;

}


export class ChangeCurrentPasswordDto {

    @IsNotEmpty()
    @ApiProperty({ type: 'string', description: 'Current User Password', required: true})
    currentPassword:string;

    @IsNotEmpty()
    @ApiProperty({ type: 'string', description: 'User New Password', required: true})
    newPassword:string;

}