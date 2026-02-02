import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exception/base.exception';

export class AccessTokenExpiredException extends BaseException {
  constructor() {
    super('ACCESS_TOKEN_EXPIRED', '액세스 토큰이 만료되었습니다.', HttpStatus.UNAUTHORIZED);
  }
}

export class RefreshTokenExpiredException extends BaseException {
  constructor() {
    super('REFRESH_TOKEN_EXPIRED', '리프레시 토큰이 만료되었습니다.', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidAccessTokenException extends BaseException {
  constructor() {
    super('INVALID_ACCESS_TOKEN', '유효하지 않은 액세스 토큰입니다.', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidRefreshTokenException extends BaseException {
  constructor() {
    super('INVALID_REFRESH_TOKEN', '유효하지 않은 리프레시 토큰입니다.', HttpStatus.UNAUTHORIZED);
  }
}

export class AccessTokenNotExpiredException extends BaseException {
  constructor() {
    super(
      'ACCESS_TOKEN_NOT_EXPIRED',
      '액세스 토큰이 아직 만료되지 않았습니다.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
