import { BullModule } from "@nestjs/bull";
import { forwardRef, Module } from "@nestjs/common";
import { UploadConsumer } from "./consumers/upload.consumer";
import { TypeOrmModule } from "@nestjs/typeorm";
import Report from "../report/model/report.entity";
import { AzureBlobService } from "src/media/service/azure/azure-file-upload.service";
import * as dotenv from "dotenv";
import SubscriptionEntity from "src/notify-me/model/notify-me.entity";

import { NotifyMeConsumer } from "./consumers/notify.consumer";
import { EMailModule } from "src/mails/mail.module";
import { MessagingModule } from "src/sms/verification.module";
import { SubscribersProcessor } from "./consumers/subscribers.consumer";
import { StatisticsModule } from "src/statistics/statistics.module";
import { OriginConsumer } from "./consumers/create-origin.consumer";
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, SubscriptionEntity]),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host:
            process.env.NODE_ENV === "development"
              ? "127.0.0.1"
              : process.env.REDIS_HOST_PROD,
          port:
            process.env.NODE_ENV === "development"
              ? 6379
              : parseInt(process.env.REDIS_PORT_PROD),
          password:
            process.env.NODE_ENV === "development"
              ? ""
              : process.env.REDIS_PASSWORD_PROD,
        },
      }),
    }),
    forwardRef(() => MessagingModule),
    forwardRef(() => EMailModule),
    forwardRef(()=> StatisticsModule),
    BullModule.registerQueue({
      name: "upload-files",
      defaultJobOptions: {
        removeOnComplete: true,
        delay: 5000,
      },
    }),
    BullModule.registerQueue({
      name: "notify-me",
      defaultJobOptions: {
        removeOnComplete: true,
        delay: 5000,
      },
    }),
    BullModule.registerQueue({
      name: "messageSubscribers",
      defaultJobOptions: {
        removeOnComplete: true,
        delay: 5000,
      },
    }),

    BullModule.registerQueue({
      name: "originLog",
      defaultJobOptions: {
        removeOnComplete: true,
        delay: 5000,
      },
    }),
  ],
  providers: [
    UploadConsumer,
    NotifyMeConsumer,
    AzureBlobService,
    SubscribersProcessor,
    OriginConsumer

  ],
  exports: [
    BullModule.registerQueue({
      name: "upload-files",
    }),
    BullModule.registerQueue({
      name: "notify-me",
    }),
    BullModule.registerQueue({
      name: "messageSubscribers",
    }),
    BullModule.registerQueue({
      name: "originLog",
    }),
  ],
})
export class QueueModule {}
