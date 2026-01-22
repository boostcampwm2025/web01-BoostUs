import { ApiProperty } from '@nestjs/swagger';
import { AnswerUserDto } from './answer-user.dto';
import { ContentState } from 'src/generated/prisma/enums';

export class AnswerResponseDto {
  @ApiProperty({
    description: '답변 ID',
    example: '1',
  })
  id!: string; // BigInt → string

  @ApiProperty({
    description: '질문 ID',
    example: '1',
  })
  questionId!: string; // BigInt → string

  @ApiProperty({
    description: '답변 내용',
    example: '# 답변\n\n그 정도는 알아서 하세요.',
  })
  contents!: string;

  @ApiProperty({
    description: '채택 여부',
    example: false,
  })
  isAccepted!: boolean;

  @ApiProperty({
    description: '추천 수',
    example: 5,
  })
  upCount!: number; // Prisma upCount

  @ApiProperty({
    description: '비추천 수',
    example: 0,
  })
  downCount!: number; // Prisma downCount

  @ApiProperty({
    description: '콘텐츠 상태',
    enum: ContentState,
    example: ContentState.PUBLISHED,
  })
  state!: ContentState;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-19T12:00:00Z',
  })
  createdAt!: string; // ISO string

  @ApiProperty({
    description: '수정일시',
    example: '2024-01-19T12:00:00Z',
  })
  updatedAt!: string; // ISO string

  @ApiProperty({
    description: '작성자 정보',
    type: () => AnswerUserDto,
  })
  member!: AnswerUserDto;
}
