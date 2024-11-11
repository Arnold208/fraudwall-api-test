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
import Report from "src/report/model/report.entity";
import { Logger } from "@nestjs/common";
import { AzureBlobService } from "src/media/service/azure/azure-file-upload.service";

@Processor("upload-files")
export class UploadConsumer {
  private readonly logger = new Logger(UploadConsumer.name);

  constructor(
    private readonly uploadService: AzureBlobService,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>
  ) {}

  @Process("uploadReportFiles")
  async handleReportFilesUpload(
    job: Job<{ reportId: string; files: Express.Multer.File[] }>
  ) {
    try {
      const { reportId, files } = job.data;

      // Re-fetch the request
      const report = await this.reportRepository.findOne({
        where: {
          reportId,
        },
      });
      if (!report) {
        throw new Error(`Report not found for ID ${reportId}`);
      }

      // Upload files and save URLs to request
      report.reportFiles = [];
      const uploadedFileUrls = await this.uploadService.uploadFiles(files);
      report.reportFiles.push(...uploadedFileUrls);

      await this.reportRepository.save(report);
      this.logger.log("Files uploaded successfully")
    } catch (error:any) {
      this.logger.error(
        `Error occurred while uploading files: ${error?.message}`
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
