import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS = Symbol('REDIS');

export const redisProvider = {
  provide: REDIS,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new Redis({
      host: config.getOrThrow('REDIS_HOST'),
      port: Number(config.getOrThrow('REDIS_PORT')),
      password: config.get('REDIS_PASSWORD') || undefined,
    });
  },
};
