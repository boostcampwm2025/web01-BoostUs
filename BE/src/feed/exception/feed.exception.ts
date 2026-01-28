import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exception/base.exception';

/**
 * RSS 피드를 찾을 수 없을 때 발생하는 예외
 */
export class FeedNotFoundException extends BaseException {
  constructor(feedId?: number | bigint) {
    super(
      'FEED_NOT_FOUND',
      '피드를 찾을 수 없습니다.',
      HttpStatus.NOT_FOUND,
      feedId ? { feedId: feedId.toString() } : undefined,
    );
  }
}

/**
 * RSS 피드 수정/삭제 권한이 없을 때 발생하는 예외
 */
export class FeedForbiddenException extends BaseException {
  constructor(action: '수정' | '삭제') {
    super(
      'FEED_FORBIDDEN',
      `피드를 ${action}할 권한이 없습니다.`,
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * RSS 피드 URL 유효성 검증 실패 시 발생하는 예외
 */
export class InvalidFeedUrlException extends BaseException {
  constructor(message: string, details?: Record<string, any>) {
    super('INVALID_FEED_URL', message, HttpStatus.BAD_REQUEST, details);
  }
}

/**
 * 캠퍼 미인증 시 발생하는 예외
 */
export class UnauthorizedCohortException extends BaseException {
  constructor() {
    super(
      'UNAUTHORIZED_COHORT',
      '캠퍼 인증이 완료된 수료자만 RSS 피드를 등록할 수 있습니다.',
      HttpStatus.FORBIDDEN,
    );
  }
}
