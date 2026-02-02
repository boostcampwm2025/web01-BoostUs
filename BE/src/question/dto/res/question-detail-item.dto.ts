import { Expose, Type } from 'class-transformer';
import { QuestionResponseDto } from './question-response.dto';
import { AnswerResponseDto } from 'src/answer/dto/res/answer-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionDetailItemDto {
  @ApiProperty({ type: () => QuestionResponseDto })
  @Expose()
  @Type(() => QuestionResponseDto)
  question!: QuestionResponseDto;

  @ApiProperty({ type: () => AnswerResponseDto, isArray: true })
  @Expose()
  @Type(() => AnswerResponseDto)
  answers!: AnswerResponseDto[];
}
