import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class CreateReportGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const token = authorizationHeader.split(" ")[1]; // Extract the token from the Authorization header

    try {
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY); // Decode the token
      if (decodedToken && decodedToken?.verify) {
        return true; // Allow access if verify property is true
      }

      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    } catch (error:any) {
      console.error("Error decoding token:", error?.message);
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
  }
}
