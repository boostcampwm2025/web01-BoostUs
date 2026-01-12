import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CommonResponseDto } from "../dto/common-response.dto";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, CommonResponseDto<T>> {

  intercept(
    _: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<CommonResponseDto<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: '성공적으로 응답되었습니다.',
        error: null,
        data,
      })),
    );
  }
}
