import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { MemberDto } from 'src/member/dto/member.dto';
import { ContentState } from 'src/generated/prisma/enums';

type HasAnswerCount = {
  _count?: {
    answers?: number;
  };
};

export class QuestionResponseDto {
  @ApiProperty({
    description: '질문 ID (BigInt → string)',
    example: '1',
  })
  @Expose()
  @Transform(({ value }) => String(value))
  id!: string;

  @ApiProperty({
    description: '질문 제목',
    example: 'NestJS에서 DTO는 왜 필요한가요?',
  })
  @Expose()
  title!: string;

  @ApiProperty({
    description: '질문 내용',
    example: '# 질문\n\nDTO가 필요한 이유가 궁금합니다.',
  })
  @Expose()
  contents!: string;

  @ApiProperty({
    description: '해시태그 목록 (DB에서는 "a,b,c" 형태일 수 있음)',
    example: ['nestjs', 'dto', 'swagger'],
    type: [String],
  })
  @Expose()
  @Transform(({ value }) => (typeof value === 'string' && value.length > 0 ? value.split(',') : []))
  hashtags!: string[];

  @ApiProperty({
    description: '추천 수',
    example: 12,
  })
  @Expose()
  upCount!: number;

  @ApiProperty({
    description: '비추천 수',
    example: 1,
  })
  @Expose()
  downCount!: number;

  @ApiProperty({
    description: '조회 수',
    example: 234,
  })
  @Expose()
  viewCount!: number;

  @ApiProperty({
    description: '해결 여부',
    example: false,
  })
  @Expose()
  isResolved!: boolean;

  @ApiProperty({
    description: '콘텐츠 상태',
    enum: ContentState,
    example: ContentState.PUBLISHED,
  })
  @Expose()
  state!: ContentState;

  @ApiProperty({
    description: '답변 개수',
    example: 3,
  })
  @Expose()
  @Transform(({ obj }: { obj: HasAnswerCount }) => Number(obj._count?.answers ?? 0))
  answerCount!: number;

  @ApiProperty({
    description: '생성일시 (ISO string)',
    example: '2024-01-19T12:00:00.000Z',
  })
  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value.toISOString() : String(value)))
  createdAt!: string;

  @ApiProperty({
    description: '수정일시 (ISO string)',
    example: '2024-01-19T12:00:00.000Z',
  })
  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value.toISOString() : String(value)))
  updatedAt!: string;

  @ApiProperty({
    description: '작성자 정보',
    type: () => MemberDto,
  })
  @Expose()
  @Type(() => MemberDto)
  member!: MemberDto;
}
