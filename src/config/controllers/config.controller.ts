import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";

import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { ConfigRule } from "../config.entity";
import { ConfigRuleService } from "../services/config.service";
import {
  CreateConfigRuleDto,
  UpdateConfigRuleDto,
} from "../dtos/create-config-rule.dto";
import { Roles } from "src/authorization/decorators/role.decorator";

@ApiTags("Configuration Rules")
@Roles('admin')
@UseGuards(JwtAuthGuard)
@Controller("config-rule")
export class ConfigRuleController {
  constructor(private readonly configRuleService: ConfigRuleService) {}

  @Get()
  async getAllConfigRules(): Promise<ConfigRule[]> {
    return await this.configRuleService.getAllConfigRules();
  }

  @Get(":id")
  async getConfigRule(
    @Param("id", new ParseUUIDPipe()) id: string
  ): Promise<ConfigRule> {
    return await this.configRuleService.getConfigRuleById(id);
  }

  @Post()
  async createConfigRule(
    @Body() configRuleData: CreateConfigRuleDto
  ): Promise<object> {
    return await this.configRuleService.createConfigRule(configRuleData);
  }

  @Put(":id")
  async updateConfigRule(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() configRuleData: UpdateConfigRuleDto
  ): Promise<object> {
    return await this.configRuleService.updateConfigRule(id, configRuleData);
  }

  @Delete(":id")
  async deleteConfigRule(
    @Param("id", new ParseUUIDPipe()) id: string
  ): Promise<object> {
    return await this.configRuleService.deleteConfigRule(id);
  }
}
