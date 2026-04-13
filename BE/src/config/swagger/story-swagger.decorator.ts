import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CreateStoryRequestDto,
  CreateStoryResponseDto,
  StoryListResponseDto,
  StoryResponseDto,
} from 'src/story/dto';

export function GetStoriesSwagger() {
  return applyDecorators(
    ApiExtraModels(StoryListResponseDto),
    ApiOperation({
      summary: '스토리 목록 조회',
      description: '발행된 스토리 목록을 조회합니다. 정렬 기준과 집계 기간을 선택할 수 있습니다.',
    }),
    ApiResponse({
      status: 200,
      description: '스토리 목록 조회 성공',
      type: StoryListResponseDto,
    }),
  );
}

export function GetStorySwagger() {
  return applyDecorators(
    ApiExtraModels(StoryResponseDto),
    ApiOperation({
      summary: '스토리 상세 조회',
      description:
        '특정 스토리의 상세 정보를 조회합니다. 조회수 증가는 POST /stories/:id/view 를 사용하세요.',
    }),
    ApiParam({
      name: 'id',
      description: '스토리 ID',
      example: '1',
      type: 'string',
    }),
    ApiResponse({
      status: 200,
      description: '스토리 상세 조회 성공',
      type: StoryResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: '스토리를 찾을 수 없음',
    }),
  );
}

export function IncrementStoryViewSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '스토리 조회수 증가',
      description:
        '특정 스토리의 조회수를 1 증가시킵니다. bid 쿠키 기반으로 동일 뷰어의 중복 증가를 방지합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '스토리 ID',
      example: '1',
      type: 'string',
    }),
    ApiResponse({
      status: 201,
      description: '조회수 증가 처리 완료',
    }),
    ApiResponse({
      status: 404,
      description: '스토리를 찾을 수 없음',
    }),
  );
}

export function CreateStorySwagger() {
  return applyDecorators(
    ApiExtraModels(CreateStoryRequestDto, CreateStoryResponseDto),
    ApiOperation({
      summary: '스토리 생성',
      description: '새로운 스토리를 생성합니다. (크롤러 전용)',
    }),
    ApiBody({
      type: CreateStoryRequestDto,
    }),
    ApiResponse({
      status: 201,
      description: '스토리 생성 성공',
      type: CreateStoryResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청',
    }),
  );
}

export function LikeStorySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '캠퍼들의 이야기 좋아요 등록',
      description: '로그인한 사용자가 캠퍼들의 이야기에 좋아요를 등록합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '스토리 ID',
      example: '1',
      type: 'string',
    }),
    ApiResponse({
      status: 200,
      description: '좋아요 등록 성공',
      schema: {
        type: 'object',
        properties: {
          storyId: {
            type: 'string',
            example: '1',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '인증 실패',
    }),
    ApiResponse({
      status: 404,
      description: '스토리를 찾을 수 없음',
    }),
    ApiResponse({
      status: 409,
      description: '이미 좋아요한 상태',
    }),
  );
}

export function UnlikeStorySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '캠퍼들의 이야기 좋아요 취소',
      description: '로그인한 사용자가 캠퍼들의 이야기 좋아요를 취소합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '스토리 ID',
      example: '1',
      type: 'string',
    }),
    ApiResponse({
      status: 200,
      description: '좋아요 취소 성공',
      schema: {
        type: 'object',
        properties: {
          storyId: {
            type: 'string',
            example: '1',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '인증 실패',
    }),
    ApiResponse({
      status: 404,
      description: '스토리를 찾을 수 없음',
    }),
    ApiResponse({
      status: 400,
      description: '좋아요하지 않은 상태',
    }),
  );
}

export function CheckStoryLikeStatusSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '캠퍼들의 이야기 좋아요 상태 확인',
      description: '로그인한 사용자가 특정 스토리에 좋아요를 눌렀는지 확인합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '스토리 ID',
      example: '1',
      type: 'string',
    }),
    ApiResponse({
      status: 200,
      description: '좋아요 상태 확인 성공',
      schema: {
        type: 'object',
        properties: {
          isLiked: {
            type: 'boolean',
            example: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '인증 실패',
    }),
    ApiResponse({
      status: 404,
      description: '스토리를 찾을 수 없음',
    }),
  );
}
