import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import FraudNumberEntity from "../model/feedback.entity";

import FeedbackEntity from "../model/feedback.entity";
import { FeedbackDto } from "../dto/feedback.dto";
import { ApiResponse } from "src/sms/type/api-response";

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);
  // contstructor
  constructor(
    @InjectRepository(FraudNumberEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>
  ) {}

  private handleDatabaseError(error: any): void {
    switch (error?.code) {
      case "23502":
        throw new BadRequestException("Please provide all required fields.");
      case "23503":
        throw new BadRequestException("Foreign key not provided.");
      case "23505":
        throw new ConflictException("Record already exist");
      case "42703":
        throw new BadRequestException("Valid payload required");
      default:
        throw error;
    }
  }

  public async createFeedback(data: FeedbackDto): Promise<object> {
    try {
      // Create a new feedback
      const feedback = this.feedbackRepository.create({
        ...data,
      });
      // Save the new fraud number
      let saveFraudNumber = await this.feedbackRepository.save(feedback);

      return {
        message: "Feedback created successfully",
        data: saveFraudNumber,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // get all feedbacks with pagination
  public async getFeedbacks(
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse> {
    try {
      const skip = (page - 1) * pageSize;

      const result = await this.feedbackRepository.find({
        skip: skip,
        take: pageSize,
      });

      return {
        message: "Feedbacks found",
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  // get feedback by id
  public async getFeedbackById(feedbackId: string): Promise<ApiResponse> {
    try {
      let results = await this.feedbackRepository.findOne({
        where: { feedbackId },
      });

      if (results) {
        return {
          message: "Feedback found",
          statusCode: HttpStatus.OK,
          data: results,
        };
      }

      throw new NotFoundException(`Feedback with Id: ${feedbackId} Not Found`);
    } catch (error) {
      throw error;
    }
  }

  // remove feedback by id
  public async removeFeedback(feedbackId: string) {
    try {
      let feedback = await this.feedbackRepository.findOne({
        where: { feedbackId },
      });
      if (feedback !== null) {
        await this.feedbackRepository.remove(feedback);
        return {
          message: "Feedback removed successfully",
          status: HttpStatus.OK,
        };
      }
      throw new HttpException(
        `Feedback ${feedbackId} Not Found`,
        HttpStatus.NOT_FOUND
      );
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }
}
