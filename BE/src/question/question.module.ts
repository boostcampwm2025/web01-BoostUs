import { Module } from '@nestjs/common';
import { ViewModule } from 'src/view/view.module';
import { AuthRepository } from 'src/auth/auth.repository';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';

@Module({
  imports: [ViewModule],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository, AuthRepository],
})
export class QuestionModule {}
