import { Module } from '@nestjs/common';
import { FeedModule } from '../feed/feed.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { ViewService } from '../view/view.service';
import { StoryController } from './story.controller';
import { StoryRepository } from './story.repository';
import { StoryService } from './story.service';

@Module({
  imports: [PrismaModule, FeedModule, RedisModule],
  controllers: [StoryController],
  providers: [StoryService, StoryRepository, ViewService],
})
export class StoryModule { }
