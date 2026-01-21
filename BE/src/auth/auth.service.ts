import { Injectable } from '@nestjs/common';
import { GithubAuthClient } from './github-auth.client';
import { COHORT_ORG_MAP } from './type/cohort.type';
import { plainToInstance } from 'class-transformer';
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

    const payload = {
      ...userInfo,
      cohort,
    };
    const dto = plainToInstance(GithubLoginResponseDto, payload, { excludeExtraneousValues: true });
    return await this.authRepository.upsertByGithubProfile(dto);
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
