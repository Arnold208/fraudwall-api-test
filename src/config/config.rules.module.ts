import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigRule } from "./config.entity";
import { ConfigRuleController } from "./controllers/config.controller";
import { ConfigRuleService } from "./services/config.service";

@Module({
  imports: [TypeOrmModule.forFeature([ConfigRule])],
  controllers: [ConfigRuleController],
  providers: [ConfigRuleService],
  exports: [ConfigRuleService],
})
export class ConfigRuleModule {}
