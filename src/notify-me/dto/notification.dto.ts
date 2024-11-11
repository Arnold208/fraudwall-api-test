import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class NotificationDto {
  @IsNotEmpty()
  @ApiProperty({
    type: "string",
  })
  message?: string;
}
