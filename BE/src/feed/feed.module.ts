import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { MemberModule } from '../member/member.module';
import { FeedController } from './feed.controller';
import { FeedRepository } from './feed.repository';
import { FeedService } from './feed.service';
import { FeedValidatorService } from './feed-validator.service';
import { StoryRepository } from '../story/story.repository';

@Module({
  imports: [PrismaModule, HttpModule, MemberModule],
  controllers: [FeedController],
  providers: [FeedService, FeedRepository, FeedValidatorService, StoryRepository],
  exports: [FeedService, FeedRepository],
})
export class FeedModule {}
