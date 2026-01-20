import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // 에러 로깅
    this.logger.error(`${req.method} ${req.url} - ${status}`, exception.stack);

    // exceptionResponse가 객체인지 확인하고 타입 지정 (lint 오류 방지를 위해 추가)
    const responseBody =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as Record<string, unknown>)
        : {
            message:
              typeof exceptionResponse === 'string'
                ? exceptionResponse
                : '알 수 없는 오류가 발생했습니다.',
          };

    res.status(status).json({
      success: false,
      error: {
        code: (responseBody.code as string) || 'UNKNOWN_ERROR',
        message: (responseBody.message as string) || '알 수 없는 오류가 발생했습니다.',
        status,
        details: responseBody.details as Record<string, any> | undefined,
      },
      data: null,
    });
  }
}
