import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CreateRiskLevelDto, UpdateRiskLevelDto } from "../dto/risk-level.dto";
import { RiskLevelService } from "../services/risk-level.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { Roles } from "src/authorization/decorators/role.decorator";
import { RoleGuard } from "src/authentication/guards/role.guard";

@ApiTags("Risk Levels")
@UseGuards(JwtAuthGuard)
@Controller("risk-levels")
export class RiskLevelController {
  constructor(private readonly riskLevelService: RiskLevelService) {}

  @Get()
  async getRiskLevels() {
    return await this.riskLevelService.getRiskLevels();
  }

  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Get(":id")
  async getRiskLevel(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.riskLevelService.getRiskLevel(id);
  }

  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Post()
  async createRiskLevel(@Body() payload: CreateRiskLevelDto) {
    return await this.riskLevelService.createRiskLevel(payload);
  }

  @UseGuards(RoleGuard)
  @Roles("admin","super_user")
  @Put(":id")
  async updateRiskLevel(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() payload: UpdateRiskLevelDto
  ) {
    return await this.riskLevelService.updateRiskLevel(id, payload);
  }
}
