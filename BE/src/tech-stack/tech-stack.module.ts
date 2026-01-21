import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TechStackController } from './tech-stack.controller';
import { TechStackRepository } from './tech-stack.repository';
import { TechStackService } from './tech-stack.service';

@Module({
  imports: [PrismaModule],
  controllers: [TechStackController],
  providers: [TechStackService, TechStackRepository],
})
export class TechStackModule {}
