import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exception/base.exception';

export class TokenExpiredException extends BaseException {
  constructor() {
    super('TOKEN_EXPIRED', '액세스 토큰이 만료되었습니다.', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidTokenException extends BaseException {
  constructor() {
    super('INVALID_TOKEN', '유효하지 않은 토큰입니다.', HttpStatus.UNAUTHORIZED);
  }
}

export class MissingTokenException extends BaseException {
  constructor() {
    super('MISSING_TOKEN', '토큰이 제공되지 않았습니다.', HttpStatus.UNAUTHORIZED);
  }
}
