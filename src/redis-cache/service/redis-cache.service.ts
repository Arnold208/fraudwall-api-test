import { Injectable , Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class RedisCacheService{
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache){}

    async setKey(reporters_number: string, verification_code: string){
        await this.cacheManager.set(reporters_number,verification_code, 300000);
    }

    async getKey(reporters_number: string){
        return await this.cacheManager.get(reporters_number);
    }

    async deleteKey(reporters_number: string){
        await this.cacheManager.del(reporters_number);
    }

    async reset(_reporters_number: string){
        await this.cacheManager.reset();
    }
}