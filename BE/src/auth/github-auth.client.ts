import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  TokenResponse,
  GithubUserResponse,
  GithubOrgResponse,
  GithubLoginPayload,
} from './type/github-client.type';

@Injectable()
export class GithubAuthClient {
  constructor(private readonly http: HttpService) {}

  async exchangeCodeForToken(code: string): Promise<string> {
    const res = await firstValueFrom(
      this.http.post<TokenResponse>(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          redirect_uri: process.env.GITHUB_REDIRECT_URI,
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      ),
    );

    return res.data.access_token;
  }

  async getUserInfoByAccessToken(accessToken: string): Promise<GithubLoginPayload> {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    };

    const userResponse = await firstValueFrom(
      this.http.get<GithubUserResponse>('https://api.github.com/user', { headers }),
    );

    const orgsResponse = await firstValueFrom(
      this.http.get<GithubOrgResponse[]>('https://api.github.com/user/orgs', {
        headers,
      }),
    );

    return {
      githubId: userResponse.data.id,
      githubLogin: userResponse.data.login,
      avatarUrl: userResponse.data.avatar_url,
      orgLogins: orgsResponse.data.map((o) => o.login),
    };
  }
}
