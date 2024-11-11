// src/config-rule/services/config-rule.service.ts

import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigRule } from "../config.entity";
import {
  CreateConfigRuleDto,
  UpdateConfigRuleDto,
} from "../dtos/create-config-rule.dto";

@Injectable()
export class ConfigRuleService {
  constructor(
    @InjectRepository(ConfigRule)
    private readonly configRuleRepository: Repository<ConfigRule>
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
  async getAllConfigRules(): Promise<ConfigRule[]> {
    try {
      return await this.configRuleRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getConfigRuleById(id: string): Promise<ConfigRule> {
    try {
      const configKey = await this.configRuleRepository.findOne({
        where: { ruleId: id },
      });

      if (!configKey) {
        throw new NotFoundException(`ConfigRule with ID ${id} not found`);
      }

      return configKey;
    } catch (error) {
      throw error;
    }
  }

  async createConfigRule(configKeyData: CreateConfigRuleDto): Promise<object> {
    try {
      const newConfigKey = new ConfigRule();
      newConfigKey.ruleName = configKeyData.ruleName;
      newConfigKey.value = configKeyData.value;

      await this.configRuleRepository.save(newConfigKey);
      return {
        message: "New config rule created",
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async updateConfigRule(
    id: string,
    configKeyData: UpdateConfigRuleDto
  ): Promise<object> {
    try {
      const configObjectExist = await this.configRuleRepository.findOne({
        where: {ruleId: id}
      });
      if (!configObjectExist) {
        throw new NotFoundException("Configuration rule not found");
      }
      if (configKeyData.ruleName)
        configObjectExist.ruleName = configKeyData.ruleName;
      if (configKeyData.value) configObjectExist.value = configKeyData.value;
      await this.configRuleRepository.save(configObjectExist);

      return {
        message: "Config rule updated successfully",
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async deleteConfigRule(ruleId: string): Promise<object> {
    try {
      const deleteResult = await this.configRuleRepository.delete(ruleId);

      if (deleteResult.affected === 0) {
        throw new NotFoundException(
          `Config rule wwith ID: ${ruleId} not found`
        );
      }

      return {
        message: "Config rule removed successfully",
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }
}
