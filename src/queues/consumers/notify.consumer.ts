// upload.consumer.ts
import {
  Processor,
  Process,
  OnQueueFailed,
  BullQueueEvents,
  OnQueueEvent,
} from "@nestjs/bull";
import { Job } from "bull";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Logger } from "@nestjs/common";
import SubscriptionEntity from "src/notify-me/model/notify-me.entity";
import { HubtelService } from "src/sms/service/hubtel.message";
import { MailService } from "src/mails/service/mail.service";

@Processor("notify-me")
export class NotifyMeConsumer {
  private readonly logger = new Logger(NotifyMeConsumer.name);

  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly notifyMeRepository: Repository<SubscriptionEntity>,
    private readonly sendMessageService: HubtelService,
    private readonly emailService: MailService
  ) {}

  @Process("sendMessage")
  async handleSendMessage(job: Job<{ suspectNumber: string }>) {
    try {
      const { suspectNumber } = job.data;

      // search for subscriber
      const subscriberExist = await this.notifyMeRepository.findOne({
        where: {
          subscriberNumber: suspectNumber,
        },
      });
      if (subscriberExist) {
        // send message
        const message = `Your number: ${suspectNumber} has been reported for involvement in mobile money fraud.`;
        await this.sendMessageService.sendMessage(suspectNumber, message);
        this.logger.log("Message sent successfully");
      }
    } catch (error: any) {
      this.logger.error(
        `Error occurred while sening message: ${error?.message}`
      );
      throw error;
    }
  }

  @Process("sendEmail")
  async handleSendMail(job: Job<{ suspectNumber: string }>) {
    try {
      const { suspectNumber } = job?.data;

      // search for subscriber
      const subscriberExist = await this.notifyMeRepository.findOne({
        where: {
          subscriberNumber: suspectNumber,
        },
      });
      if (subscriberExist && subscriberExist?.subscriberEmail !== null) {
        // send message
        const message = `Your number: ${suspectNumber} has been reported for involvement in mobile money fraud.`;
        const subject = "Notification";
        await this.emailService.sendMail(
          subscriberExist?.subscriberEmail,
          subject,
          message
        );
        this.logger.log("Email sent successfully");
      }
    } catch (error: any) {
      this.logger.error(
        `Error occurred while sening message: ${error?.message}`
      );
      throw error;
    }
  }

  @OnQueueFailed()
  handleFailure(job: Job, error: any) {
    this.logger.error(`Failed job ${job.id}: ${error.message}`, error.stack);
  }

  @OnQueueEvent(BullQueueEvents.COMPLETED)
  handleCompleted(job: Job, _result: any) {
    this.logger.log(`Job ${job.id} has completed!`);
  }
}
