import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import * as jwt from "jsonwebtoken";
import { UserService } from "src/user/services/user.service";

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      const token = authorizationHeader.split(" ")[1];
      try {
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await this.userService.getUser(decodedToken?.sub);
        request.user = user;
        request.token = decodedToken;
      } catch (error: any) {
        console.log(`Error decoding token: ${error?.message}`);
      }
    }

    return next.handle().pipe(tap());
  }
}
