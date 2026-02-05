import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { AnswerRepository } from './answer.repository';
import { AuthRepository } from 'src/auth/auth.repository';

@Module({
  controllers: [AnswerController],
  providers: [AnswerService, AnswerRepository, AuthRepository],
})
export class AnswerModule {}
