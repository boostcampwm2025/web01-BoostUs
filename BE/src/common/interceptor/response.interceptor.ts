import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonResponseDto } from '../dto/common-response.dto';

type WrappedResponse<T> = {
  message?: string;
  data?: T;
};

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

function isWrappedResponse<T>(x: unknown): x is WrappedResponse<T> {
  if (!isObject(x)) return false;

  if ('message' in x && typeof x.message !== 'string') return false;

  return true;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, CommonResponseDto<T>> {
  intercept(_: ExecutionContext, next: CallHandler<T>): Observable<CommonResponseDto<T>> {
    return next.handle().pipe(
      map((res: unknown) => {
        const defaultMessage = '성공적으로 응답되었습니다.';

        let message = defaultMessage;
        let data: T;

        if (isWrappedResponse<T>(res)) {
          message = res.message ?? defaultMessage;
          data = (res.data ?? res) as T; // res 자체가 data일 수도 있어서 fallback
        } else {
          data = res as T;
        }

        return {
          success: true,
          message,
          error: null,
          data,
        };
      }),
    );
  }
}
