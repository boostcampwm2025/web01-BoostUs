import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { RefreshTokenExpiredException } from 'src/auth/exception/auth.exception';
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
  ) {}

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
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
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

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: '액세스 토큰 재발급',
    description: '리프레시 토큰을 사용하여 새로운 액세스 토큰과 리프레시 토큰을 발급합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 재발급 성공',
  })
  @ApiResponse({
    status: 400,
    description: '액세스 토큰이 아직 만료되지 않음',
  })
  @ApiResponse({
    status: 401,
    description: '리프레시 토큰 만료 또는 유효하지 않음',
  })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookies = req.cookies as Record<string, string | undefined> | undefined;
    const accessToken = cookies?.accessToken ?? '';
    const refreshToken = cookies?.refreshToken ?? '';

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new RefreshTokenExpiredException();
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(accessToken, refreshToken);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: Number(this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN')) * 1000, // 초 -> 밀리초
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN')) * 1000, // 초 -> 밀리초
    });

    return null;
  }

  @Public()
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookies = req.cookies as Record<string, string | undefined> | undefined;
    const refreshToken = cookies?.refreshToken;

    // 리프레시 토큰이 있으면 Redis에서 삭제
    if (typeof refreshToken === 'string') {
      try {
        const { memberId } = await this.authService.verifyRefreshToken(refreshToken);
        await this.authService.deleteRefreshTokenFromRedis(memberId);
      } catch {
        // 리프레시 토큰이 유효하지 않거나 만료된 경우 무시하고 계속 진행
        // (이미 만료되었거나 유효하지 않은 토큰이므로)
      }
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return null;
  }
}
