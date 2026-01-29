import { Expose, Type, Transform } from 'class-transformer';
import { MemberDto } from './member.dto';

export class AnswerResponseDto {
  @Expose()
  @Transform(({ value }) => value?.toString())
  id!: string;

  @Expose()
  @Transform(({ value }) => value?.toString())
  questionId!: string;

  @Expose()
  contents!: string;

  @Expose()
  isAccepted!: boolean;

  @Expose()
  upCount!: number;

  @Expose()
  downCount!: number;

  @Expose()
  state!: string; // enum이면 ContentState

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
