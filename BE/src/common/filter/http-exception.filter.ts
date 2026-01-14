import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

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

    res.status(status).json({
      success: false,
      error: {
        code: exceptionResponse['code'] || 'UNKNOWN_ERROR',
        message: exceptionResponse['message'] || '알 수 없는 오류가 발생했습니다.',
        status,
        details: exceptionResponse['details'] || undefined,
      },
      data: null,
    });
  }
}
