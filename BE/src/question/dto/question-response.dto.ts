import { Expose, Transform, Type } from 'class-transformer';
import { MemberDto } from './member.dto';
import { ContentState } from 'src/generated/prisma/enums';

type HasAnswerCount = {
  _count?: {
    answers?: number;
  };
};

export class QuestionResponseDto {
  @Expose()
  @Transform(({ value }) => String(value))
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  contents!: string;

  @Expose()
  @Transform(({ value }) => (typeof value === 'string' && value.length > 0 ? value.split(',') : []))
  hashtags!: string[];

  @Expose()
  upCount!: number;

  @Expose()
  downCount!: number;

  @Expose()
  viewCount!: number;

  @Expose()
  isResolved!: boolean;

  @Expose()
  state!: ContentState;

  @Expose()
  @Transform(({ obj }: { obj: HasAnswerCount }) => Number(obj._count?.answers ?? 0))
  answerCount!: number;

  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value.toISOString() : String(value)))
  createdAt!: string;

  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value.toISOString() : String(value)))
  updatedAt!: string;

  @Expose()
  @Type(() => MemberDto)
  member!: MemberDto;
}
