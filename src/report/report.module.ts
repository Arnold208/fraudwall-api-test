import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReportController } from "./controller/report.controller";
import Report from "./model/report.entity";
import { ReportService } from "./service/report.service";
import { QueueModule } from "src/queues/queues.module";
import { CaseFileModule } from "src/case-file/case-file.module";
import ReportThreshold from "./model/report-threshold.entity";
import ReportPlatform from "./model/report-platform";
import FraudNumberEntity from "../fraud-number/model/fraud-number.entity";
import { ReportPlatformController } from "./controller/report-platform.controller";
import { ReportPlatformService } from "./service/report-platform.service";
import { ReportThresholdController } from "./controller/report-threshold.controller";
import { ReportThresholdService } from "./service/threshold.service";
import { JwtService } from "@nestjs/jwt";
import { FraudNumberModule } from "src/fraud-number/fraud-number.module";
import { MessagingModule } from "src/sms/verification.module";
import { AzureBlobService } from "src/media/service/azure/azure-file-upload.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      ReportThreshold,
      ReportPlatform,
      FraudNumberEntity,
    ]),
    MessagingModule,
    forwardRef(() => QueueModule),
    forwardRef(() => CaseFileModule),
    forwardRef(() => FraudNumberModule),
  ],
  controllers: [
    ReportController,
    ReportPlatformController,
    ReportThresholdController,
  ],
  providers: [
    ReportService,
    ReportPlatformService,
    ReportThresholdService,
    JwtService,
    AzureBlobService
  ],
  exports: [ReportService],
})
export default class ReportModule {}
