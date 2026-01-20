import { ApiProperty } from '@nestjs/swagger';
import { ContentState } from 'src/generated/prisma/enums';
import { QuestionUserDto } from './question-user.dto';

export class QuestionResponseDto {
  @ApiProperty({
    description: '질문 ID',
    example: '1',
  })
  id!: string; // BigInt → string

  @ApiProperty({
    description: '질문 제목',
    example: 'NestJS에서 Prisma를 사용하는 방법은?',
  })
  title!: string;

  @ApiProperty({
    description: '질문 내용',
    example: '# 질문\n\nNestJS에서 Prisma를 설정하는 방법을 알고 싶습니다.',
  })
  contents!: string;

  @ApiProperty({
    description: '해시태그 목록',
    example: ['NestJS', 'Prisma', 'TypeScript'],
    type: [String],
  })
  hashtags!: string[];

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
    description: '조회수',
    example: 42,
  })
  viewCount!: number;

  @ApiProperty({
    description: '해결 여부',
    example: false,
  })
  isResolved!: boolean;

  @ApiProperty({
    description: '콘텐츠 상태',
    enum: ContentState,
    example: ContentState.PUBLISHED,
  })
  contentState!: ContentState;

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
    type: () => QuestionUserDto,
  })
  user!: QuestionUserDto;
}
