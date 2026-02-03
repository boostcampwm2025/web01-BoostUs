import { Module } from '@nestjs/common';
import { RecommendService } from './recommend.service';
import { RecommendController } from './recommend.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecommendRepository } from './recommend.repository';

@Module({
  imports: [PrismaModule],
  controllers: [RecommendController],
  providers: [RecommendService, RecommendRepository],
})
export class RecommendModule {}
