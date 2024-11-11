import { OmitType, PartialType } from "@nestjs/swagger";
import { AddReportToCaseFileDto } from "./add-report-case.dto";
export class UpdateCaseFileDto extends PartialType(
  OmitType(AddReportToCaseFileDto, ["suspectNumber"])
) {
 
}
