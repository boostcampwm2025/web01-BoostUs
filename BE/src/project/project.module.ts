import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ViewService } from 'src/view/view.service';
import { ProjectRepository } from './project.repository';
import { AuthRepository } from 'src/auth/auth.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [ProjectController],
  providers: [ProjectService, ViewService, ProjectRepository, AuthRepository],
})
export class ProjectModule {}
