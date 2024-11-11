import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import RiskLevel from "../model/risk-level.entity";
import { CreateRiskLevelDto, UpdateRiskLevelDto } from "../dto/risk-level.dto";
import { ApiResponse } from "src/sms/type/api-response";

@Injectable()
export class RiskLevelService {
  constructor(
    @InjectRepository(RiskLevel)
    private readonly riskLevelRepository: Repository<RiskLevel>
  ) {}
  private handleDatabaseError(error: any): void {
    switch (error?.code) {
      case "23502":
        throw new BadRequestException(
          "Not null violation: Please provide all required fields."
        );
      case "23503":
        throw new BadRequestException(
          "Foreign key violation: The referenced record does not exist."
        );
      case "23505":
        throw new ConflictException(
          "Unique violation: The provided data violates a unique constraint."
        );
      case "42703":
        throw new BadRequestException(
          "Undefined column: A provided column does not exist in the table."
        );
      default:
        throw error;
    }
  }

  async getRiskLevels(): Promise<ApiResponse> {
    try {
      const result = await this.riskLevelRepository.find();
      return {
        message: "Risk levels fetched",
        statusCode: HttpStatus.FOUND,
        data: result,
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async getRiskLevel(id: string): Promise<ApiResponse> {
    try {
      const riskLevel = await this.riskLevelRepository.findOne({
        where: { id },
      });

      if (!riskLevel) {
        throw new NotFoundException(`RiskLevel with ID ${id} not found`);
      }

      return {
        message: "Risk level fetched",
        statusCode: HttpStatus.FOUND,
        data: riskLevel,
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async createRiskLevel(payload: CreateRiskLevelDto): Promise<object> {
    try {
      const newRiskLevel = this.riskLevelRepository.create(payload);
      await this.riskLevelRepository.save(newRiskLevel);

      return {
        message: "New risk level created",
        statusCode: HttpStatus.CREATED,
        data: newRiskLevel,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async updateRiskLevel(
    id: string,
    payload: UpdateRiskLevelDto
  ): Promise<object> {
    try {
      const riskLevelExist = await this.riskLevelRepository.findOne({
        where: { id },
      });

      if (!riskLevelExist) {
        throw new NotFoundException("RiskLevel not found");
      }

      this.riskLevelRepository.merge(riskLevelExist, payload);
      await this.riskLevelRepository.save(riskLevelExist);

      return {
        message: "Risk level updated successfully",
        statusCode: HttpStatus.NO_CONTENT,
        data: riskLevelExist,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }
}
