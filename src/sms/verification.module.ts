import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { RedisCacheModule } from "../redis-cache/redis-cache.module";
import { VerificationController } from "./controller/verification.controller";
import { HubtelService } from "./service/hubtel.message";
import { VerificationService } from "./service/verification.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import SubscriptionEntity from "../notify-me/model/notify-me.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    RedisCacheModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (_config: ConfigService) => ({
        secret:
          process.env.NODE_ENV === "development"
            ? process.env.JWT_SECRET_KEY
            : process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: Number(process.env.JWT_EXPIRES_TIME),
        },
      }),
    }),
  ],
  controllers: [VerificationController],
  providers: [VerificationService, HubtelService],
  exports: [VerificationService, HubtelService],
})
export class MessagingModule {}
