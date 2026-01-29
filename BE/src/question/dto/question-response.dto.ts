import { Expose, Transform, Type } from 'class-transformer';
import { MemberDto } from './member.dto';

export class QuestionResponseDto {
  @Expose()
  @Transform(({ value }) => value?.toString())
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  contents!: string;

  @Expose()
  @Transform(({ obj }) => (obj.hashtags ? obj.hashtags.split(',') : []))
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
  state!: string; // enum이면 ContentState

  @Expose()
  @Transform(({ obj }) => obj?._count?.answers ?? 0)
  answerCount!: number;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  createdAt!: string;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  updatedAt!: string;

  @Expose()
  @Type(() => MemberDto)
  member!: MemberDto;
}
