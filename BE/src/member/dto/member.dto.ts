import { Expose } from 'class-transformer';

export class MemberDto {
  @Expose()
  id: bigint;

  @Expose()
  nickname: string;

  @Expose()
  avatarUrl: string | null;

  @Expose()
  cohort: number | null;
}
