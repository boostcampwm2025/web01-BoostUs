import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exception/base.exception';

/**
 * 회원을 찾을 수 없을 때 발생하는 예외
 */
export class MemberNotFoundException extends BaseException {
  constructor(memberId?: bigint) {
    super(
      'MEMBER_NOT_FOUND',
      '회원을 찾을 수 없습니다.',
      HttpStatus.NOT_FOUND,
      memberId ? { memberId } : undefined,
    );
  }
}

// 닉네임이 이미 있을 떄 발생하는 예외

export class MemberNicknameDuplicateException extends BaseException {
  constructor(nickname: string) {
    super(
      'MEMBER_NICKNAME_DUPLICATE',
      '이미 사용 중인 닉네임입니다.',
      HttpStatus.CONFLICT, // 409 Conflict (또는 400 사용 가능)
      { nickname },
    );
  }
}
