import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/authentication/dtos/jwt.payload';

export const GetReporterNumber = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token: JwtPayload = request.token;

    if (data) {
      return token?.[data];
    }
    return token;
  },
);


 