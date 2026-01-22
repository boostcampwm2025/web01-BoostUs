import { Expose } from 'class-transformer';

/**
 * Github 로그인 후 클라이언트에 보낼 응답 DTO 입니당
 */
export class GithubLoginResponseDto {
  @Expose()
  nickname?: string;

  @Expose()
  githubLogin: string; // 로그인한 깃허브 id (LimSR12)

  @Expose()
  githubId: number; // 사용자 고유 숫자 id (12341234)

  @Expose()
  avatarUrl: string;

  @Expose()
  cohort?: number | null;

  @Expose()
  state: boolean;
}
