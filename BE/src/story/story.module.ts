import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StoryController } from './story.controller';
import { StoryRepository } from './story.repository';
import { StoryService } from './story.service';

@Module({
  imports: [PrismaModule],
  controllers: [StoryController],
  providers: [StoryService, StoryRepository],
})
export class StoryModule {}
