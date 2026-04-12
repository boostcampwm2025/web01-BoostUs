import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateQuestionDto } from 'src/question/dto/req/create-question.dto';
import { UpdateQuestionDto } from 'src/question/dto/req/update-question.dto';
import { QuestionDetailItemDto } from 'src/question/dto/res/detail/question-detail-item.dto';
import { QuestionResponseDto } from 'src/question/dto/res/detail/question-response.dto';
import { QuestionCursorResponseDto } from 'src/question/dto/res/all/question-list.dto';
import { QuestionCountDto } from 'src/question/dto/res/question-count.dto';

export function CreateQuestionSwagger() {
  return applyDecorators(
    ApiExtraModels(CreateQuestionDto),
    ApiOperation({
      summary: '질문 생성',
      description: '새로운 질문을 생성합니다.',
    }),
    ApiBody({
      type: CreateQuestionDto,
    }),
    ApiResponse({
      status: 201,
      description: '질문 생성 성공',
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청',
    }),
  );
}

export function GetQuestionsCountSwagger() {
  return applyDecorators(
    ApiExtraModels(QuestionCountDto),
    ApiOperation({
      summary: '전체 질문 수 조회',
      description: '전체 질문의 수를 답변 갯수와 채택 여부를 기준으로 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '질문 상세 갯수 조회 성공',
      type: QuestionCountDto,
    }),
    ApiResponse({
      status: 404,
      description: '질문 갯수를 조회할 수 없음',
    }),
  );
}

export function GetQuestionsSwagger() {
  return applyDecorators(
    ApiExtraModels(QuestionCursorResponseDto),
    ApiOperation({
      summary: '질문 목록 조회',
      description:
        '질문 목록을 조회합니다. 상태, 정렬 기준으로 필터링하고 페이지네이션할 수 있습니다.',
    }),
    ApiResponse({
      status: 200,
      description: '질문 목록 조회 성공',
      type: QuestionCursorResponseDto,
    }),
  );
}

export function GetQuestionSwagger() {
  return applyDecorators(
    ApiExtraModels(QuestionDetailItemDto),
    ApiOperation({
      summary: '질문 상세 조회',
      description: '특정 질문의 상세 정보를 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '질문 ID',
      example: '1',
    }),
    ApiResponse({
      status: 200,
      description: '질문 상세 조회 성공',
      type: QuestionDetailItemDto,
    }),
    ApiResponse({
      status: 404,
      description: '질문을 찾을 수 없음',
    }),
  );
}

export function UpdateQuestionSwagger() {
  return applyDecorators(
    ApiExtraModels(UpdateQuestionDto, QuestionResponseDto),
    ApiOperation({
      summary: '질문 수정',
      description: '기존 질문을 수정합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '질문 수정 성공',
      type: QuestionResponseDto,
    }),
    ApiParam({
      name: 'id',
      description: '질문 ID',
      example: '1',
    }),
    ApiResponse({
      status: 404,
      description: '질문 찾기 실패',
    }),
  );
}

export function DeleteQuestionSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '질문 삭제',
      description: '기존 질문을 삭제합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '질문 ID',
      example: '1',
    }),
    ApiResponse({
      status: 200,
      description: '질문 삭제 성공',
    }),
    ApiResponse({
      status: 404,
      description: '질문을 찾을 수 없음',
    }),
  );
}

export function AcceptAnswerSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '답변 채택',
      description: '질문에 달린 답변을 채택합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '질문 ID',
      example: '1',
    }),
    ApiParam({
      name: 'answerId',
      description: '답변 ID',
      example: '1',
    }),
    ApiResponse({ status: 200, description: '답변 채택 성공' }),
    ApiResponse({ status: 404, description: '질문 또는 답변을 찾을 수 없음' }),
  );
}

export function LikeQuestionSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '질문 좋아요',
      description: '질문에 좋아요를 누릅니다.',
    }),
    ApiParam({
      name: 'id',
      description: '질문 ID',
      example: '1',
    }),
    ApiResponse({ status: 200, description: '질문 좋아요 성공' }),
    ApiResponse({ status: 404, description: '질문을 찾을 수 없음' }),
  );
}

export function DislikeQuestionSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '질문 싫어요',
      description: '질문에 싫어요를 누릅니다.',
    }),
    ApiParam({
      name: 'id',
      description: '질문 ID',
      example: '1',
    }),
    ApiResponse({ status: 200, description: '질문 싫어요 성공' }),
    ApiResponse({ status: 404, description: '질문을 찾을 수 없음' }),
  );
}
