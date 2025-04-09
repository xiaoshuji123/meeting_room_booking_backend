import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;


  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async del(key: string) {
    return await this.redisClient.del(key);
  }

  async hGetAll(key: string) {
    return await this.redisClient.hGetAll(key);
  }

  async hSet(key: string, field: string, value: string) {
    await this.redisClient.hSet(key, field, value);
  }

  async hGet(key: string, field: string) {
    return await this.redisClient.hGet(key, field);
  }

  async hDel(key: string, field: string) {
    return await this.redisClient.hDel(key, field);
  }
}
