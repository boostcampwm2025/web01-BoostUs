import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionResponseDto, ErrorDetailDto } from '../dto/exception-response.dto';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : ERROR_MESSAGES.INTERNAL_ERROR.status;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    const error =
      exceptionResponse && typeof exceptionResponse === 'object'
        ? (exceptionResponse as Partial<ErrorDetailDto>)
        : null;

    const errorDetail: ErrorDetailDto = {
      code: error?.code ?? ERROR_MESSAGES.INTERNAL_ERROR.code,
      message: error?.message ?? ERROR_MESSAGES.INTERNAL_ERROR.message,
      status,
      details: error?.details,
    };

    const errorResponse: ExceptionResponseDto = {
      success: false,
      error: errorDetail,
      data: null,
    };

    res.status(status).json(errorResponse);
  }
}
