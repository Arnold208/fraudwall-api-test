import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import * as dotenv from "dotenv";

import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/authentication/dtos/jwt.payload";

dotenv.config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    try {
      const accessToken = req.get("Authorization").replace("Bearer", "").trim();
      await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET_KEY,
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
