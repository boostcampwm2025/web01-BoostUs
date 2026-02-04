import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * Validation Pipe 검증 실패시 던지는 예외
 */
export class ValidationFailedException extends BaseException {
  constructor(details?: Record<string, any>) {
    super(
      'VALIDATION_FAILED',
      '요청 데이터 유효성 검증에 실패했습니다.',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
