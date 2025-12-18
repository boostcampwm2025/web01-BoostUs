import { Module } from '@nestjs/common';
import { ProjectsController } from './project.controller';
import { ProjectsService } from './project.service';

@Module({
  imports: [],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectModule {}
