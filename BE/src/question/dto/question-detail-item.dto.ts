import { Expose, Type } from 'class-transformer';
import { QuestionResponseDto } from './question-response.dto';
import { AnswerResponseDto } from './answer-response.dto';

export class QuestionDetailItemDto {
  @Expose()
  @Type(() => QuestionResponseDto)
  question!: QuestionResponseDto;

  @Expose()
  @Type(() => AnswerResponseDto)
  answers!: AnswerResponseDto[];
}
