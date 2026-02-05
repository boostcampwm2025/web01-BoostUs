import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';

const INTERNAL_HEADER_NAME = 'x-proxied-by';
const INTERNAL_HEADER_VALUE = 'next';

// 외부 접근을 허용해야 하는 경로들 (OAuth 콜백 등)
const EXTERNAL_ACCESS_PATHS = ['/api/auth/github/callback', '/api/auth/login'];

const isExternalAccessPath = (path: string) => {
  return EXTERNAL_ACCESS_PATHS.some((allowedPath) => path.startsWith(allowedPath));
};

// const isSwaggerPath = (path: string) => {
//   if (path === '/api' || path === '/api/') return true;
//   if (path === '/api-json') return true;
//   return path.startsWith('/api/swagger-ui');
// };

@Injectable()
export class InternalRequestGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path ?? request.url ?? '';

    // 외부 접근 허용 경로는 헤더 체크 없이 통과
    if (isExternalAccessPath(path)) {
      return true;
    }

    // if (isSwaggerPath(path)) {
    //   return true;
    // }

    const headerValue = request.header(INTERNAL_HEADER_NAME);
    if (headerValue === INTERNAL_HEADER_VALUE) {
      return true;
    }

    throw new ForbiddenException('Direct API access is not allowed.');
  }
}
