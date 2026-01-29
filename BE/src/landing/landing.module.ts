import { Module } from '@nestjs/common';
import { LandingService } from './landing.service';
import { LandingController } from './landing.controller';
import { LandingRepository } from './landing.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [LandingController],
  providers: [LandingService, LandingRepository, PrismaService],
})
export class LandingModule {}
