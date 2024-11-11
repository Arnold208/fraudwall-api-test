import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JwtService } from "@nestjs/jwt";

import OriginEntity from "./model/origin.entity";
import { StatisticsController } from "./controllers/statistics.controller";
import { StatisticsService } from "./services/statistics.service";
import { OriginService } from "./services/origin.service";
import FraudNumberEntity from "src/fraud-number/model/fraud-number.entity";
import Report from "src/report/model/report.entity";
import CaseFile from "src/case-file/entities/case-file.entity";
import FeedbackEntity from "src/feedback/model/feedback.entity";
import ReportPlatform from "src/report/model/report-platform";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OriginEntity,
      FraudNumberEntity,
      Report,
      CaseFile,
      FeedbackEntity,
      ReportPlatform
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService, OriginService, JwtService],
  exports: [StatisticsService, OriginService],
})
export class StatisticsModule {}
