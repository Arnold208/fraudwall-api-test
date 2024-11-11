import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivityLog } from "./entities/log-activity.entity";
import { ActivityLogController } from "./controllers/activity-log.controller";
import { ActivityLogService } from "./services/activity-log.service";
import { ActivityLogType } from "./entities/log-type.entity";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog,ActivityLogType])],
  controllers: [ActivityLogController],
  providers: [ActivityLogService,JwtService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
