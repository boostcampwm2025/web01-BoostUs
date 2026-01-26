import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { AuthRepository } from './auth.repository';
import { GithubLoginUpsertDto } from './dto/github-login-upsert.dto';
import { GithubAuthClient } from './github-auth.client';
import { COHORT_ORG_MAP } from './type/cohort.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly githubAuthClient: GithubAuthClient,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

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
    // TODO: 리프레시 토큰 DBMS 혹은 Redis에 저장

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
    const expiresIn = this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN');
    return this.jwtService.sign(payload, { expiresIn });
  }

  private generateRefreshToken(memberId: bigint): string {
    const payload = {
      sub: memberId.toString(),
      type: 'refresh',
    };
    const expiresIn = this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN');
    return this.jwtService.sign(payload, { expiresIn });
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
}
