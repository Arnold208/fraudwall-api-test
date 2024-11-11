import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable()
export class LogginInterceptor implements NestInterceptor{

  // create new log
  private logger = new Logger(LogginInterceptor.name)
  
  // implement interceptor interface
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const requestUrl = request.url;
    const startTime = Date.now();

    return next.handle().pipe(
      tap( ()=> {
        this.logger.log(`${method} ${requestUrl} ${Date.now() - startTime}ms : ${context.getClass().name}`);
      })
    )
  }

}