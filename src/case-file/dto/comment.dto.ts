import { ApiProperty,PartialType } from "@nestjs/swagger";


export class AddCommentToCaseFileDto {
  @ApiProperty({
    type: "string",
    required: true,
    description: "Comment description on case",
  })
  public notes: string;
}

export class UpdateCaseFileCommentDto extends PartialType(
  AddCommentToCaseFileDto
) {}
