import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from '../auth/decorator/public.decorator';
import { MemberDto } from '../member/dto/member.dto';
import { AuthService } from './auth.service';
import { CurrentMember } from './decorator/current-member.decorator';
import { GithubCallbackQueryDto } from './dto/github-callback-query.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) { }

  @Public()
  @Get('login')
  login(@Res() res: Response) {
    const params = new URLSearchParams({
      client_id: this.configService.getOrThrow('GITHUB_CLIENT_ID'),
      redirect_uri: this.configService.getOrThrow('GITHUB_REDIRECT_URI'),
      scope: 'read:org',
    });

    return res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
  }

  @Public()
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

  @Get('me')
  @ApiOperation({
    summary: '현재 로그인한 사용자 정보 조회',
    description: '액세스 토큰을 통해 현재 로그인한 사용자의 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    type: MemberDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (토큰 없음, 만료, 위조)',
  })
  async getCurrentMember(@CurrentMember() memberId: string) {
    return await this.authService.getCurrentMember(memberId);
  }

  @Get('reissue')
  async reissueToken() { }

  @Get('logout')
  async logout() { }
}
