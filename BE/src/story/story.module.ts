import { Module } from '@nestjs/common';
import { FeedModule } from '../feed/feed.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ViewModule } from '../view/view.module';
import { StoryController } from './story.controller';
import { StoryRepository } from './story.repository';
import { StoryService } from './story.service';

@Module({
  imports: [PrismaModule, FeedModule, ViewModule],
  controllers: [StoryController],
  providers: [StoryService, StoryRepository],
})
export class StoryModule {}
