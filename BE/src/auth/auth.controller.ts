import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { GithubCallbackQueryDto } from './dto/github-callback-query.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) { }

  @Get('login')
  login(@Res() res: Response) {
    const params = new URLSearchParams({
      client_id: this.configService.getOrThrow('GITHUB_CLIENT_ID'),
      redirect_uri: this.configService.getOrThrow('GITHUB_REDIRECT_URI'),
      scope: 'read:org',
    });

    return res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
  }

  @Get('github/callback')
  async githubCallback(@Query() query: GithubCallbackQueryDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.handleCallback(query.code);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: Number(this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN')) * 1000, // 초 -> 밀리초
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN')) * 1000, // 초 -> 밀리초
    });

    // 프론트엔드 메인 페이지로 리다이렉트
    const frontendUrl = this.configService.getOrThrow('FRONTEND_URL');
    return res.redirect(frontendUrl);
  }

  @Get('reissue')
  async reissueToken() { }

  @Get('logout')
  async logout() { }
}
