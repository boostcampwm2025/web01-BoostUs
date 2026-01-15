import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 커스텀 예외의 베이스 클래스
 * 모든 커스텀 예외는 이 클래스를 상속받습니다.
 */
export abstract class BaseException extends HttpException {
  constructor(
    private readonly code: string,
    message: string,
    status: HttpStatus,
    private readonly details?: Record<string, any>,
  ) {
    super(
      {
        code,
        message,
        details,
      },
      status,
    );
  }

  getCode(): string {
    return this.code;
  }

  getDetails(): Record<string, any> | undefined {
    return this.details;
  }
}
