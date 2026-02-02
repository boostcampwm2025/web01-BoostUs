import { Expose, Type } from 'class-transformer';
import { QuestionResponseDto } from './question-response.dto';
import { AnswerDetailResponseDto } from 'src/answer/dto/res/answer-detail-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionDetailItemDto {
  @ApiProperty({ type: () => QuestionResponseDto })
  @Expose()
  @Type(() => QuestionResponseDto)
  question!: QuestionResponseDto;

  @ApiProperty({ type: () => AnswerDetailResponseDto, isArray: true })
  @Expose()
  @Type(() => AnswerDetailResponseDto)
  answers!: AnswerDetailResponseDto[];
}
