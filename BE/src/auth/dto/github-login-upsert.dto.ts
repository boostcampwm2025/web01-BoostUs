import { Expose } from 'class-transformer';

/**
 * 리소스 서버로부터 받은 사용자 정보를 Upsert 할 DTO 입니당
 */
export class GithubLoginUpsertDto {
  @Expose()
  nickname?: string;

  @Expose()
  githubLogin: string;

  @Expose()
  githubId: number;

  @Expose()
  avatarUrl: string;

  @Expose()
  cohort?: number | null;
}
