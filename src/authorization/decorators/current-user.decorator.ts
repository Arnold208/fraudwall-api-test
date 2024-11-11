import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "jsonwebtoken";

export const GetCurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token: JwtPayload = request.token;
    return token;
  }
);
