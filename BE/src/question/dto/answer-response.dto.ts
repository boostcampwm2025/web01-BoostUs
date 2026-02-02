import { Expose, Type, Transform } from 'class-transformer';
import { MemberDto } from './member.dto';
import { ContentState } from 'src/generated/prisma/enums';

export class AnswerResponseDto {
  @Expose()
  @Transform(({ value }) => String(value))
  id!: string;

  @Expose()
  @Transform(({ value }) => String(value))
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
  state!: ContentState;

  @Expose()
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt!: string;

  @Expose()
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt!: string;

  @Expose()
  @Type(() => MemberDto)
  member!: MemberDto;
}
