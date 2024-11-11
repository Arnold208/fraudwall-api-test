import { Module } from "@nestjs/common";
import { JwtModule} from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { HeaderApiKeyStrategy } from "../auth-strategies/auth-header-api-key.strategy";
import { RoleGuard } from "./guards/role.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RefreshTokenGuard } from "./guards/refresh-token-guard";
import { RefreshTokenStrategy } from "src/auth-strategies/refresh-strategy";
import { AuthService } from "./service/auth.service";
import { JwtStrategy } from "src/auth-strategies/jwt-strategy.strategy";
import User from "../user/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./controllers/auth.controller";


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn:  +process.env.JWT_EXPIRES_TIME,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    HeaderApiKeyStrategy,
    AuthService,
    RefreshTokenStrategy,
    JwtAuthGuard,
    RefreshTokenGuard,
    RoleGuard,
  ],
  exports: [
    JwtAuthGuard,
    RoleGuard,
    RefreshTokenStrategy,
    RefreshTokenGuard,
    PassportModule,
  ],
})
export class AuthModule {}
