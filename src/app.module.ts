import { ConfigModule } from "@nestjs/config";
import { Module, OnModuleInit } from "@nestjs/common";
import ReportModule from "./report/report.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./authentication/auth.module";
import { FraudNumberModule } from "./fraud-number/fraud-number.module";
import { CaseFileModule } from "./case-file/case-file.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { LogginInterceptor } from "./shared/logging.interceptor";
import { AuthGuard } from "@nestjs/passport";
import { QueueModule } from "./queues/queues.module";
import ApplicationEntities from "./shared/base-entities/app-entities";
import { UserModule } from "./user/user.module";
import { ConfigRuleModule } from "./config/config.rules.module";
import { ActivityLogModule } from "./log/activity-log.module";
import * as dotenv from "dotenv";
import { AuthInterceptor } from "./interceptors/jwt.interceptor";
import { NotifyMeModule } from "./notify-me/notify-me.module";
import { EMailModule } from "./mails/mail.module";
import { MessagingModule } from "./sms/verification.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { StatisticsModule } from "./statistics/statistics.module";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "postgres",
        host:
          NODE_ENV === "development"
            ? process.env.PGHOST_DEV
            : process.env.PGHOST,
        username:
          NODE_ENV === "development"
            ? process.env.PGUSER_DEV
            : process.env.PGUSER,
        database:
          NODE_ENV === "development"
            ? process.env.PGDATABASE_DEV
            : process.env.PGDATABASE,
        password:
          NODE_ENV === "development"
            ? process.env.PGPASSWORD_DEV
            : process.env.PGPASSWORD,
        entities: [...ApplicationEntities],
        autoLoadEntities: true,
        port:
          NODE_ENV === "development"
            ? Number(process.env.PGPORT_DEV)
            : Number(process.env.PGPORT),
        ssl:
          NODE_ENV === "development"
            ? false
            : {
                rejectUnauthorized: false,
              },
      }),
    }),
    AuthModule,
    UserModule,
    MessagingModule,
    ReportModule,
    CaseFileModule,
    FraudNumberModule,
    QueueModule,
    ActivityLogModule,
    ConfigRuleModule,
    NotifyMeModule,
    EMailModule,
    FeedbackModule,
    StatisticsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogginInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard("api-key"),
    },
  ],
})
export default class AppModule  {

}
