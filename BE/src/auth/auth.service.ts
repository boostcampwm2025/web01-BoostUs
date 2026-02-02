import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import type Redis from 'ioredis';
import { MemberDto } from '../member/dto/member.dto';
import { REDIS } from '../redis/redis.provider';
import { AuthRepository } from './auth.repository';
import { GithubLoginUpsertDto } from './dto/github-login-upsert.dto';
import {
  AccessTokenNotExpiredException,
  InvalidAccessTokenException,
  InvalidRefreshTokenException,
  RefreshTokenExpiredException,,
} from './exception/auth.exception';
import { GithubAuthClient } from './github-auth.client';
import { COHORT_ORG_MAP } from './type/cohort.type';
import type { JwtPayload } from './type/jwt-payload.type';

function parseDecodedPayload(value: unknown): JwtPayload | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as JwtPayload;
  }
  return null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly githubAuthClient: GithubAuthClient,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  async handleCallback(code: string) {
    const githubAccessToken = await this.githubAuthClient.exchangeCodeForToken(code);
    const userInfo = await this.githubAuthClient.getUserInfoByAccessToken(githubAccessToken);

    const orgList = userInfo.orgLogins;
    const cohort = this.getCohortFromOrgList(orgList);

    const upsertMemberDto = plainToInstance(
      GithubLoginUpsertDto,
      {
        ...userInfo,
        cohort,
      },
      { excludeExtraneousValues: true },
    );

    const member = await this.authRepository.upsertByGithubProfile(upsertMemberDto);

    const accessToken = this.generateAccessToken(member.id);
    const refreshToken = this.generateRefreshToken(member.id);

    // 리프레시 토큰을 Redis에 저장
    await this.saveRefreshTokenToRedis(member.id.toString(), refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(memberId: bigint): string {
    const payload = {
      sub: memberId.toString(),
      type: 'access',
    };
    const expiresIn = Number(this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'));
    return this.jwtService.sign(payload, { expiresIn });
  }

  private generateRefreshToken(memberId: bigint): string {
    const payload = {
      sub: memberId.toString(),
      type: 'refresh',
    };
    const expiresIn = Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'));
    return this.jwtService.sign(payload, { expiresIn });
  }

  async getCurrentMember(memberId: string) {
    const member = await this.authRepository.findById(memberId);

    if (!member) {
      throw new InvalidAccessTokenException();
    }

    return plainToInstance(MemberDto, member, { excludeExtraneousValues: true });
  }

  private getCohortFromOrgList(orgList: string[]): number | null {
    for (const [cohortStr, orgs] of Object.entries(COHORT_ORG_MAP)) {
      const cohort = Number(cohortStr);
      if (orgs.some((org) => orgList.includes(org))) {
        return cohort;
      }
    }

    return null;
  }

  /**
   * Redis에 리프레시 토큰 저장
   * @param memberId 멤버 ID
   * @param refreshToken 리프레시 토큰
   */
  async saveRefreshTokenToRedis(memberId: string, refreshToken: string): Promise<void> {
    const key = `refresh:${memberId}`;
    const ttl = Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'));

    await this.redis.set(key, refreshToken, 'EX', ttl);
  }

  /**
   * Redis에서 리프레시 토큰 삭제 (로그아웃 시 사용)
   * @param memberId 멤버 ID
   */
  async deleteRefreshTokenFromRedis(memberId: string): Promise<void> {
    const key = `refresh:${memberId}`;
    await this.redis.del(key);
  }

  /**
   * 리프레시 토큰 검증
   * @param token 리프레시 토큰
   * @returns 멤버 ID
   */
  async verifyRefreshToken(token: string): Promise<{ memberId: string }> {
    try {
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      if (payload.type !== 'refresh') {
        throw new InvalidRefreshTokenException();
      }

      return { memberId: payload.sub ?? '' };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new RefreshTokenExpiredException();
      }
      throw new InvalidRefreshTokenException();
    }
  }

  /**
   * 액세스 토큰 만료 여부 확인
   * @param accessToken 액세스 토큰
   */
  checkAccessTokenExpired(accessToken: string): void {
    try {
      const payload = this.jwtService.decode(accessToken) as { exp?: number; type?: string } | null;

      if (!payload || payload.type !== 'access') {
        // 유효하지 않은 토큰이거나 액세스 토큰이 아니면 통과 (재발급 필요)
        return;
      }

      if (payload.exp === undefined) {
        // exp가 없으면 통과 (재발급 필요)
        return;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp > currentTime) {
        // 아직 만료되지 않았으면 예외 발생
        throw new AccessTokenNotExpiredException();
      }
    } catch (error: unknown) {
      // AccessTokenNotExpiredException은 그대로 throw
      if (error instanceof AccessTokenNotExpiredException) {
        throw error;
      }
      // 다른 에러는 무시하고 통과 (재발급 필요)
    }
  }

  /**
   * 토큰 재발급
   * @param accessToken 액세스 토큰
   * @param refreshToken 리프레시 토큰
   * @returns 새로운 액세스 토큰과 리프레시 토큰
   */
  async refreshTokens(
    accessToken: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. 액세스 토큰 만료 여부 확인
    this.checkAccessTokenExpired(accessToken);

    // 2. 리프레시 토큰 검증
    const { memberId } = await this.verifyRefreshToken(refreshToken);

    // 3. Redis에서 리프레시 토큰 조회 및 일치 여부 확인
    const key = `refresh:${memberId}`;
    const storedRefreshToken = await this.redis.get(key);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      throw new InvalidRefreshTokenException();
    }

    // 4. 새로운 액세스 토큰과 리프레시 토큰 생성
    const newAccessToken = this.generateAccessToken(BigInt(memberId));
    const newRefreshToken = this.generateRefreshToken(BigInt(memberId));

    // 5. 새 리프레시 토큰을 Redis에 저장
    await this.saveRefreshTokenToRedis(memberId, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
