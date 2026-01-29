import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';
import { RedisModule } from 'src/redis/redis.module';
import { ViewService } from 'src/view/view.service';

@Module({
  imports: [RedisModule],
  controllers: [QuestionController],
  providers: [QuestionService, ViewService, QuestionRepository],
})
export class QuestionModule {}
