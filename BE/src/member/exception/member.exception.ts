import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exception/base.exception';

/**
 * 회원을 찾을 수 없을 때 발생하는 예외
 */
export class MemberNotFoundException extends BaseException {
  constructor(memberId?: string) {
    super(
      'MEMBER_NOT_FOUND',
      '회원을 찾을 수 없습니다.',
      HttpStatus.NOT_FOUND,
      memberId ? { memberId } : undefined,
    );
  }
}
