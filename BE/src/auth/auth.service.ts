import { Injectable } from '@nestjs/common';
import { GithubAuthClient } from './github-auth.client';
import { COHORT_ORG_MAP } from './type/cohort.type';
import { plainToInstance } from 'class-transformer';
import { GithubLoginUpsertDto } from './dto/github-login-upsert.dto';
import { GithubLoginResponseDto } from './dto/github-login-response.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly githubAuthClient: GithubAuthClient,
    private readonly authRepository: AuthRepository,
  ) {}

  async handleCallback(code: string) {
    const accessToken = await this.githubAuthClient.exchangeCodeForToken(code);
    const userInfo = await this.githubAuthClient.getUserInfoByAccessToken(accessToken);

    const orgList = userInfo.orgLogins;
    const cohort = this.getCohortFromOrgList(orgList);

    const dto = plainToInstance(
      GithubLoginUpsertDto,
      {
        ...userInfo,
        cohort,
      },
      { excludeExtraneousValues: true },
    );

    const member = await this.authRepository.upsertByGithubProfile(dto);

    return plainToInstance(GithubLoginResponseDto, member, { excludeExtraneousValues: true });
  }

  getCohortFromOrgList(orgList: string[]): number | null {
    for (const [cohortStr, orgs] of Object.entries(COHORT_ORG_MAP)) {
      const cohort = Number(cohortStr);
      if (orgs.some((org) => orgList.includes(org))) {
        return cohort;
      }
    }

    return null;
  }
}
