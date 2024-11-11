import { Module, forwardRef } from "@nestjs/common";
import { CaseFileService } from "./services/case-file.service";
import { CaseFileController } from "./controllers/case-file.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import CaseFile from "./entities/case-file.entity";
import User from "../user/entities/user.entity";
import { Comment } from "./entities/comment.entity";
import Report from "../report/model/report.entity";
import { CaseFileStatus } from "./entities/case-status.entity";
import { CaseFileStatusController } from "./controllers/status.controller";
import { CaseFileStatusService } from "./services/case-status.service";
import { ActivityLogModule } from "src/log/activity-log.module";
import ReportThreshold from "../report/model/report-threshold.entity";
import FraudNumberEntity from "../fraud-number/model/fraud-number.entity";
import { FraudNumberModule } from "src/fraud-number/fraud-number.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CaseFile,
      User,
      CaseFileStatus,
      Comment,
      Report,
      ReportThreshold,
      FraudNumberEntity,
    ]),
    forwardRef(() => ActivityLogModule),
    forwardRef(() => FraudNumberModule),
  ],
  controllers: [CaseFileController, CaseFileStatusController],
  providers: [CaseFileService, CaseFileStatusService, JwtService],
  exports: [CaseFileService],
})
export class CaseFileModule {}
