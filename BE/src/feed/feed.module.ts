import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { FeedController } from './feed.controller';
import { FeedRepository } from './feed.repository';
import { FeedService } from './feed.service';
import { FeedValidatorService } from './feed-validator.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [FeedController],
  providers: [FeedService, FeedRepository, FeedValidatorService],
  exports: [FeedService, FeedRepository],
})
export class FeedModule {}
