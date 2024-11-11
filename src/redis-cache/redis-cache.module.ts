import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { RedisCacheService } from "./service/redis-cache.service";
import * as redisStore from "cache-manager-redis-store";
import * as dotenv from "dotenv";
dotenv.config();

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      useFactory: () => ({
        isGlobal: true,
        store: redisStore,
        host:
          process.env.NODE_ENV === "development"
            ? "127.0.0.1"
            : process.env.REDIS_HOST_PROD,
        port:
          process.env.NODE_ENV === "development"
            ? 6379
            : parseInt(process.env.REDIS_PORT_PROD),
        password:
          process.env.NODE_ENV === "development"
            ? ""
            : process.env.REDIS_PASSWORD_PROD,
        ttl: +process.env.CACHE_TTL,
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
