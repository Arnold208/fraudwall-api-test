import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HubtelSms } from "hubtel-sms-extended";
import SubscriptionEntity from "src/notify-me/model/notify-me.entity";
import { Repository } from "typeorm";

@Injectable()
export class HubtelService {
  private readonly logger = new Logger(HubtelService.name);

  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriberRepository: Repository<SubscriptionEntity>
  ) {}

  async sendSmsToken(
    reporterNumber: string,
    verificationCode: string
  ): Promise<any> {
    try {
      const hubtelSms = new HubtelSms({
        clientId: process.env.HUBTEL_CLIENT_ID,
        clientSecret: process.env.HUBTEL_CLIENT_SECRET,
      });

      return await hubtelSms.quickSend({
        From: "FraudWall",
        Content: `${verificationCode} is your one-time code for verifying and report a suspected number.Never Share or forward this code. #SayNoToScam`,
        To: reporterNumber,
      });
    } catch (error) {
      this.logger.error(
        `Error while sending verification code ${verificationCode} error: ${error}`
      );
      throw error;
    }
  }

  //send sms message
  async sendMessage(receipient: string, messageBody: string): Promise<any> {
    try {
      const hubtelSms = new HubtelSms({
        clientId: process.env.HUBTEL_CLIENT_ID,
        clientSecret: process.env.HUBTEL_CLIENT_SECRET,
      });

      return await hubtelSms.quickSend({
        From: process.env.HUBTEL_SENDER_ID,
        Content: messageBody,
        To: receipient,
      });
    } catch (error) {
      this.logger.error(`Error while sending message: ${error}`);
      throw error;
    }
  }

  async sendBatchMessagesToSubscribers(
    subscribers: SubscriptionEntity[],
    message: string
  ): Promise<void> {
    const messageHash = this.createHash(message);
    for (const subscriber of subscribers) {
      if (subscriber.lastMessageHash === messageHash) {
        continue; // Skip sending as this message was already sent
      }
      await this.sendMessage(subscriber?.subscriberNumber, message);

      // Update last message hash
      subscriber.lastMessageHash = messageHash;
      await this.subscriberRepository.save(subscriber);
    }
  }

  private createHash(input: string): string {
    // Hashing message
    return require("crypto").createHash("md5").update(input).digest("hex");
  }
}
