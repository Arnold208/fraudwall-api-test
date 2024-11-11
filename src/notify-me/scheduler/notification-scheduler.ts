import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotifyMeService } from '../services/notify-me.service';

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(
    private subscriberService: NotifyMeService,
    @InjectQueue('messageSubscribers') private notifyMeQueue: Queue
  ) {}

  @Cron('0 */6 * * *') // runs every 6 hours
  async handleCron() {
    this.logger.debug('Called every 6 hours');
    const subscribers = await this.subscriberService.getAllSubscribers();
    if (subscribers?.data?.length > 0) {
      await this.notifyMeQueue.add('sendBatchEmails', {
        subscribers,
        message: 'Regular update from our platform.'
      });
    }
  }
}
