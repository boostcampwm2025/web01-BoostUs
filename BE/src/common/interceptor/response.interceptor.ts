// common/interceptors/response.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonResponseDto } from '../dto/common-response.dto';
import { RESPONSE_MESSAGE_KEY } from '../decorator/response-message.decorator';
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, CommonResponseDto<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<CommonResponseDto<T>> {
    const handler = context.getHandler();
    const cls = context.getClass();

    // 메서드 > 클래스 순으로 override
    const customMessage = this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
      handler,
      cls,
    ]);

    const message = customMessage ?? '성공적으로 응답되었습니다.';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message,
        error: null,
        data,
      })),
    );
  }
}
