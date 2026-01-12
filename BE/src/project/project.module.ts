import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
