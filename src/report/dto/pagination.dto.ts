import { IsOptional, IsPositive } from "class-validator"

export class PaginationQueryDto{

    @IsPositive()
    @IsOptional()
    public offset: number
    
    @IsPositive()
    @IsOptional()
    public  limit: number
}