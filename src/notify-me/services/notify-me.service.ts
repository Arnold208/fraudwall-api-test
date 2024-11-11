import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cache } from "cache-manager";
import { Injectable } from "@nestjs/common";

import SubscriptionEntity from "../model/notify-me.entity";
import {
  CreateSubscriptionDto,
  RemoveSubscriberDto,
} from "../dto/notify-me.dto";
import { CACHE_MANAGER, CacheTTL } from "@nestjs/cache-manager";
import { NotificationDto } from "../dto/notification.dto";
import { Queue } from "bull";
import { InjectQueue } from "nest-bull";
import { ApiResponse } from "src/sms/type/api-response";

@Injectable()
export class NotifyMeService {
  private readonly logger = new Logger(NotifyMeService.name);
  // contstructor
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly notifyMeRepository: Repository<SubscriptionEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @InjectQueue("messageSubscribers")
    private readonly sendSubsribersMessage: Queue
  ) {}

  private handleDatabaseError(error: any): void {
    switch (error?.code) {
      case "23502":
        throw new BadRequestException("Please provide all required fields.");
      case "23505":
        throw new ConflictException("Record already exist");
      case "42703":
        throw new BadRequestException("Valid payload required");
      default:
        throw error;
    }
  }

  public async create(data: CreateSubscriptionDto): Promise<object> {
    try {
      const { email, phoneNumber } = data;
      // Check if notify me already exist
      const recordExist = await this.notifyMeRepository
        .createQueryBuilder("subscriber")
        .where("subscriber.subscriberEmail = :email", { email })
        .orWhere("subscriber.subscriberNumber = :phoneNumber", { phoneNumber })
        .getOne();
      if (recordExist) {
        throw new ConflictException(
          `User with email ${email} or phone number ${phoneNumber} has already subscribed.`
        );
      }

      // Create a new fraud number entity
      let newSubscriber = new SubscriptionEntity();
      newSubscriber.subscriberEmail = email ? email : null;
      newSubscriber.subscriberNumber = phoneNumber;
      newSubscriber.notifyMe = true;
      // Save the new fraud number
      let savedData = await this.notifyMeRepository.save(newSubscriber);

      return {
        message: "New subscriber created",
        data: savedData,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  public async sendNotification(data: NotificationDto): Promise<object> {
    try {
      const subscribers = await this.getAllSubscribers();
      const { message } = data;
      await this.sendSubsribersMessage.add("sendBatchMessage", {
        subscribers,
        message,
      });
      await this.sendSubsribersMessage.add("sendBatchEmails", {
        subscribers,
        message,
      });

      return {
        message: "Sending notification in progress",
        data: null,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // get all subscribers
  public async getAll(): Promise<ApiResponse> {
    try {
      const result = await this.notifyMeRepository.find({});
      return {
        message: "All notify data fetched",
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  // find subscriber id
  public async getById(id: string): Promise<ApiResponse> {
    try {
      let result = await this.notifyMeRepository.findOne({
        where: { subscriptionId: id },
      });

      if (result) {
        return {
          message: "Notify me found",
          statusCode: HttpStatus.OK,
          data: result,
        };
      }

      throw new NotFoundException(`Subscriber with: ${id} Not Found`);
    } catch (error) {
      throw error;
    }
  }

  // remove subscriber
  public async removeById(payload: RemoveSubscriberDto) {
    try {
      const { email, phoneNumber } = payload;
      const subscriberFound = await this.notifyMeRepository
        .createQueryBuilder("subscriber")
        .where("subscriber.subscriberEmail = :email", { email })
        .orWhere("subscriber.subscriberNumber = :phoneNumber", { phoneNumber })
        .getOne();
      if (subscriberFound) {
        await this.notifyMeRepository.remove(subscriberFound);
        return {
          message: "Subscriber removed successfully",
          status: HttpStatus.OK,
        };
      }

      throw new HttpException("Subscriber Not Found", HttpStatus.NOT_FOUND);
    } catch (error) {
      throw error;
    }
  }

  async getAllSubscribers(): Promise<ApiResponse> {
    try {
      const subscribers = await this.notifyMeRepository.find();

      return {
        message: "Subscribers fetched",
        statusCode: HttpStatus.OK,
        data: subscribers,
      };
    } catch (error) {
      throw error;
    }
  }

  // @Cacheable()
  @CacheTTL(3600) // cache for 1 hour
  async getSubscribers(): Promise<SubscriptionEntity[]> {
    const cachedSubscribers = await this.cacheManager.get<SubscriptionEntity[]>(
      "subscribers"
    );
    if (cachedSubscribers) {
      return cachedSubscribers;
    }
    const subscribers = await this.notifyMeRepository.find();
    await this.cacheManager.set("subscribers", subscribers, 3600);
    return subscribers;
  }

  async cacheLastMessageHash(
    subscriberId: number,
    hash: string
  ): Promise<void> {
    await this.cacheManager.set(
      `subscriber:${subscriberId}:lastMessageHash`,
      hash,
      3600
    ); // 24 hours cache
  }

  async getLastMessageHash(subscriberId: number): Promise<string | null> {
    return this.cacheManager.get(`subscriber:${subscriberId}:lastMessageHash`);
  }
}
