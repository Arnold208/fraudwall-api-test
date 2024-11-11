import {
  Processor,
  Process,
  OnQueueFailed,
  OnQueueEvent,
  BullQueueEvents,
} from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { CreateOriginDto } from "src/statistics/dto/origin.dto";

import { OriginService } from "src/statistics/services/origin.service";

@Processor("originLog")
export class OriginConsumer {
  private readonly logger = new Logger(OriginConsumer.name);

  constructor(private readonly originService: OriginService) {}

  @Process("createOrigin")
  async sendEmails(job: Job<{ modelName: string, origin:string, suspectNumber: string }>) {
    const data: CreateOriginDto = job.data as CreateOriginDto
    try {
      await this.originService.createOrigin({
        modelName: data?.modelName,
        origin: data?.origin,
        suspectNumber: data?.suspectNumber
      });
    } catch (error) {
      this.logger.error("Failed to create origin log", JSON.stringify(error));
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
