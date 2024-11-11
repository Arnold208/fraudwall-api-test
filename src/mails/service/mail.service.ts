import { MailerService } from "@nestjs-modules/mailer";
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";

import { Repository } from "typeorm";
import SubscriptionEntity from "src/notify-me/model/notify-me.entity";
import User from "src/user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriberRepository: Repository<SubscriptionEntity>
  ) {}

  async sendMail(to: string, subject: string, html: string): Promise<any> {
    const msg = {
      to,
      from: {
        name: "Fraud-Wall",
        address: process.env.MAIL_FROM,
      },
      subject,
      html,
    };

    try {
      const result = await this.mailerService.sendMail(msg);
      if (result) {
        return {
          message: "Email sent successfully",
          statusCode: HttpStatus.OK,
          error: null,
        };
      }
      throw new BadRequestException("Error sending mail");
    } catch (error) {
      throw error;
    }
  }

  async sendBatchEmails(
    subscribers: SubscriptionEntity[],
    message: string
  ): Promise<void> {
    const messageHash = this.createHash(message);
    for (const subscriber of subscribers) {
      // Skip if the subscriber has no email address or has already received this message
      if (
        !subscriber.subscriberEmail ||
        subscriber.lastMessageHash === messageHash
      ) {
        continue;
      }

      await this.mailerService.sendMail({
        to: subscriber.subscriberEmail,
        subject: "Notification",
        text: message,
      });

      // Update last message hash after successfully sending the email
      subscriber.lastMessageHash = messageHash;
      await this.subscriberRepository.save(subscriber);
    }
  }

  private createHash(input: string): string {
    // Simple hashing function, consider using a more robust approach
    return require("crypto").createHash("md5").update(input).digest("hex");
  }

  async passwordResetMail(userId: string, resetToken: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { userId },
      });
      if (!user) {
        return;
      }
      const firstName = `${user?.firstName}`;
      const to: string = user?.email;
      const subject = " Password Reset";
      const html: string = `Hello ${firstName} please use the reset token below
                            to reset your password: ${resetToken}
                            `;
      const result = await this.sendMail(to, subject, html);
      if (
        result.error === null ||
        result.message === "Email sent successfully"
      ) {
        this.logger.log("Password-reset email sent successfully to user");
        return;
      }
    } catch (error) {
      this.logger.error(`Error sending password reset mail to user: ${error}`);
      return;
    }
  }
}
