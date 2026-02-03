// src/question/dto/res/question-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseQuestionDto } from '../base-question.dto';
import { ContentState } from 'src/generated/prisma/enums';

export class QuestionResponseDto extends BaseQuestionDto {
  @ApiProperty({
    description: '질문 내용',
    example: '# 질문\n\nDTO가 필요한 이유가 궁금합니다.',
  })
  @Expose()
  contents!: string;

  @ApiProperty({
    description: '콘텐츠 상태',
    enum: ContentState,
    example: ContentState.PUBLISHED,
  })
  @Expose()
  state!: ContentState;
}
