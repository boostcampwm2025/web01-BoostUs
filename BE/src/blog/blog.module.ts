import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogsService } from './blog.service';

@Module({
  imports: [],
  controllers: [BlogController],
  providers: [BlogsService],
})
export class BlogModule {}
