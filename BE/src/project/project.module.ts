import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ViewModule } from 'src/view/view.module';
import { AuthRepository } from 'src/auth/auth.repository';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [PrismaModule, ViewModule, HttpModule, RedisModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, AuthRepository, JwtService],
})
export class ProjectModule {}
