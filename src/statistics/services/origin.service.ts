import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import OriginEntity from "../model/origin.entity";
import { CreateOriginDto } from "../dto/origin.dto";

@Injectable()
export class OriginService {
  private readonly logger = new Logger(OriginService.name);
  // contstructor
  constructor(
    @InjectRepository(OriginEntity)
    private readonly originRepository: Repository<OriginEntity>
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

  //
  public async createOrigin(payload: CreateOriginDto): Promise<void> {
    try {
      const newOrigin = this.originRepository.create({
        modelName: payload?.modelName,
        origin: payload?.origin,
        suspectNumber: payload?.suspectNumber || null,
      });

      await this.originRepository.save(newOrigin);
      this.logger.log("Origin created successfully");
    } catch (error: any) {
      this.logger.log(`There was an error creating origin: ${error?.message}`);
    }
  }
}
