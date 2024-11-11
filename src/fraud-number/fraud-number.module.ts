import { Module, forwardRef } from "@nestjs/common";
import { FraudNumberService } from "./services/fraud-number.service";
import { FraudNumberController } from "./controllers/fraud-number.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import FraudNumberEntity from "./model/fraud-number.entity";
import ReportModule from "src/report/report.module";
import { ActivityLogModule } from "src/log/activity-log.module";
import { RiskLevelController } from "./controllers/risk-level.controller";
import { RiskLevelService } from "./services/risk-level.service";
import RiskLevel from "./model/risk-level.entity";
import { JwtService } from "@nestjs/jwt";
import Report from "../report/model/report.entity";
import { QueueModule } from "src/queues/queues.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([FraudNumberEntity, RiskLevel,Report]),
    forwardRef(()=>ReportModule),
    forwardRef(() => ActivityLogModule),
    forwardRef(()=>QueueModule)
  ],
  controllers: [FraudNumberController, RiskLevelController],
  providers: [FraudNumberService, RiskLevelService, JwtService],
  exports: [FraudNumberService],
})
export class FraudNumberModule {}
