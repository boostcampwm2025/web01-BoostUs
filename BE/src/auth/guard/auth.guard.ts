import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import {
  AccessTokenExpiredException,
  InvalidAccessTokenException,
} from '../exception/auth.exception';
import type { JwtPayload } from '../type/jwt-payload.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // @Public 데코레이터가 있는지 확인
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractAccessToken(request);

    // Public 엔드포인트이고 토큰이 없는 경우 바로 통과 (Pubic 엔드포인트이지만 토큰이 있는 경우에는 토큰 검증 시도)
    if (isPublic && !accessToken) {
      return true;
    }

    // Public 엔드포인트가 아니고 토큰이 없는 경우 에러 발생
    if (!accessToken) {
      throw new AccessTokenExpiredException();
    }

    try {
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync<JwtPayload>(accessToken, {
        secret,
      });

      // 액세스 토큰인지 확인
      if (payload.type !== 'access') {
        throw new InvalidAccessTokenException();
      }

      // 요청 객체에 사용자 정보 추가
      request['member'] = {
        id: payload.sub,
        role: payload.role,
      };

      return true;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new AccessTokenExpiredException();
      }
      throw new InvalidAccessTokenException();
    }
  }

  private extractAccessToken(request: Request): string | undefined {
    const cookies = request.cookies as Record<string, string | undefined> | undefined;
    const token = cookies?.accessToken;
    return typeof token === 'string' ? token : undefined;
  }
}
