import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [ProjectModule, BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
