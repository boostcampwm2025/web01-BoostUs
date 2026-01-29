import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LandingService } from './landing.service';
import { LandingController } from './landing.controller';
import { LandingRepository } from './landing.repository';

@Module({
  imports: [PrismaModule],
  controllers: [LandingController],
  providers: [LandingService, LandingRepository],
})
export class LandingModule {}
