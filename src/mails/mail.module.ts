import { Module } from "@nestjs/common";
import { MailService } from "./service/mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { TypeOrmModule } from "@nestjs/typeorm";
import SubscriptionEntity from "../notify-me/model/notify-me.entity";
import User from "../user/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity, User]),
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT),
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class EMailModule {}
