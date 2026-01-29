import { Expose, Transform } from 'class-transformer';

export class MemberDto {
  @Expose()
  @Transform(({ value }) => value?.toString())
  id!: string;

  @Expose()
  nickname!: string;

  @Expose()
  avatarUrl!: string | null;

  @Expose()
  cohort!: number | null;
}
