import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubCallbackQueryDto } from './dto/github-callback-query.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  @Redirect()
  login() {
    const params = new URLSearchParams({
      client_id: this.configService.getOrThrow('GITHUB_CLIENT_ID'),
      redirect_uri: this.configService.getOrThrow('GITHUB_REDIRECT_URI'),
      scope: 'read:org',
    });

    return {
      url: `https://github.com/login/oauth/authorize?${params.toString()}`,
    };
  }

  @Get('github/callback')
  async githubCallback(@Query() query: GithubCallbackQueryDto) {
    return await this.authService.handleCallback(query.code);
  }

  @Get('reissue')
  async reissueToken() {}

  @Get('logout')
  async logout() {}
}
