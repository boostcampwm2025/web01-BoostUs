import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exception/base.exception';

/**
 * 질문을 찾을 수 없을 때 발생하는 예외
 */
export class QuestionNotFoundException extends BaseException {
  constructor(questionId?: bigint) {
    super(
      'QUESTION_NOT_FOUND',
      '질문을 찾을 수 없습니다.',
      HttpStatus.NOT_FOUND,
      questionId ? { questionId: questionId.toString() } : undefined,
    );
  }
}
