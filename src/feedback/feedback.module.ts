import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JwtService } from "@nestjs/jwt";
import { FeedbackService } from "./services/feedback.service";
import FeedbackEntity from "./model/feedback.entity";
import { FeedbackController } from "./controllers/feedback.controller";

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity])],
  controllers: [FeedbackController],
  providers: [FeedbackService, JwtService],
})
export class FeedbackModule {}
