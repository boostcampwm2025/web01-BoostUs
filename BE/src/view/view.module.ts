import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { ViewFlushService } from './view-flush.service';
import { ViewService } from './view.service';

@Module({
  imports: [RedisModule, PrismaModule],
  providers: [ViewService, ViewFlushService],
  exports: [ViewService],
})
export class ViewModule {}
