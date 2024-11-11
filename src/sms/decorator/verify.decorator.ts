import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Verified = createParamDecorator((_data: any, context: ExecutionContext)=>{
    const request = context.switchToHttp().getRequest();
    
    if(!request.verify){
        return request.verify = false;
    }
})