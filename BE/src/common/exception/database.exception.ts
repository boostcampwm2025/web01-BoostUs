import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * 데이터베이스 연결 실패 시 발생하는 예외
 */
export class DatabaseConnectionException extends BaseException {
  constructor(details?: Record<string, any>) {
    super(
      'DB_CONNECTION_FAILED',
      '데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

/**
 * 데이터베이스 쿼리 실행 실패 시 발생하는 예외
 */
export class DatabaseQueryException extends BaseException {
  constructor(query?: string, details?: Record<string, any>) {
    super(
      'DB_QUERY_FAILED',
      '데이터베이스 쿼리 실행 중 오류가 발생했습니다.',
      HttpStatus.INTERNAL_SERVER_ERROR,
      query ? { query, ...details } : details,
    );
  }
}

/**
 * 데이터베이스 트랜잭션 실패 시 발생하는 예외
 */
export class DatabaseTransactionException extends BaseException {
  constructor(details?: Record<string, any>) {
    super(
      'DB_TRANSACTION_FAILED',
      '트랜잭션 처리 중 오류가 발생했습니다.',
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}
