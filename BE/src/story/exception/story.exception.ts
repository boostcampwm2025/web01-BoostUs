import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exception/base.exception';

/**
 * 이미 좋아요한 캠퍼들의 이야기에 다시 좋아요를 시도할 때 발생하는 예외
 */
export class StoryAlreadyLikedException extends BaseException {
  constructor(storyId?: bigint) {
    super(
      'STORY_ALREADY_LIKED',
      '이미 좋아요한 캠퍼들의 이야기입니다.',
      HttpStatus.CONFLICT,
      storyId ? { storyId: storyId.toString() } : undefined,
    );
  }
}

/**
 * 좋아요하지 않은 캠퍼들의 이야기에 좋아요 취소를 시도할 때 발생하는 예외
 */
export class StoryNotLikedException extends BaseException {
  constructor(storyId?: bigint) {
    super(
      'STORY_NOT_LIKED',
      '좋아요하지 않은 캠퍼들의 이야기입니다.',
      HttpStatus.BAD_REQUEST,
      storyId ? { storyId: storyId.toString() } : undefined,
    );
  }
}

/**
 * 캠퍼들의 이야기를 찾을 수 없을 때 발생하는 예외
 */
export class StoryNotFoundException extends BaseException {
  constructor(storyId?: bigint) {
    super(
      'STORY_NOT_FOUND',
      '캠퍼들의 이야기를 찾을 수 없습니다.',
      HttpStatus.NOT_FOUND,
      storyId ? { storyId: storyId.toString() } : undefined,
    );
  }
}
