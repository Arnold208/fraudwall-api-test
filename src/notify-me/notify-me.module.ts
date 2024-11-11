import { Module, forwardRef } from "@nestjs/common";
import { NotifyMeService } from "./services/notify-me.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivityLogModule } from "src/log/activity-log.module";
import { JwtService } from "@nestjs/jwt";
import SubscriptionEntity from "./model/notify-me.entity";
import { NotifyMeController } from "./controllers/notify-me.controller";
import { QueueModule } from "src/queues/queues.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    forwardRef(() => ActivityLogModule),
    forwardRef(() => QueueModule),
  ],
  controllers: [NotifyMeController],
  providers: [NotifyMeService, JwtService],
  exports: [NotifyMeService],
})
export class NotifyMeModule {}
