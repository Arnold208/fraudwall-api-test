import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from "@nestjs/common";
import { Observable, throwError, TimeoutError } from "rxjs";

import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class ErrorHandlerInterceptor implements NestInterceptor{
  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

    return next.handle().pipe(
      catchError(_err => throwError(() => new BadRequestException("Invalid File type"))),
      timeout(5000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    )
  }

}