import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';

const INTERNAL_HEADER_NAME = 'x-proxied-by';
const INTERNAL_HEADER_VALUE = 'next';

// const isSwaggerPath = (path: string) => {
//   if (path === '/api' || path === '/api/') return true;
//   if (path === '/api-json') return true;
//   return path.startsWith('/api/swagger-ui');
// };

@Injectable()
export class InternalRequestGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    // const path = request.path ?? request.url ?? '';

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
