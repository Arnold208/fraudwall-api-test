import {
  Processor,
  Process,
  OnQueueFailed,
  OnQueueEvent,
  BullQueueEvents,
} from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { MailService } from "src/mails/service/mail.service";
import SubscriptionEntity from "src/notify-me/model/notify-me.entity";
import { HubtelService } from "src/sms/service/hubtel.message";

@Processor("messageSubscribers")
export class SubscribersProcessor {
  private readonly logger = new Logger(SubscribersProcessor.name);

  constructor(
    private readonly emailService: MailService,
    private readonly messageService: HubtelService
  ) {}

  @Process("sendBatchEmails")
  async sendEmails(
    job: Job<{ subscribers: SubscriptionEntity[]; message: string }>
  ) {
    const { subscribers, message } = job.data;
    try {
      await this.emailService.sendBatchEmails(subscribers, message);
    } catch (error) {
      console.error("Failed to send emails", error);
      // Handle error appropriately
    }
  }

  @Process("sendBatchMessage")
  async sendMessage(
    job: Job<{ subscribers: SubscriptionEntity[]; message: string }>
  ) {
    const { subscribers, message } = job?.data;
    try {
      await this.messageService.sendBatchMessagesToSubscribers(
        subscribers,
        message
      );
    } catch (error) {
      console.error("Failed to send emails", error);
      // Handle error appropriately
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
