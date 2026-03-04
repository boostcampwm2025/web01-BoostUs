import { getSchemaPath } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';

/**
 * 성공 응답을 기존에 사용하던 공통 래퍼(CommonResponseDto) 형태로 구성합니다.
 * `dataSchema`에는 엔드포인트별 실제 data 구조(객체/배열/DTO ref)를 전달합니다.
 */
export const successResponseSchema = (dataSchema: Record<string, unknown>) => ({
  allOf: [
    { $ref: getSchemaPath(CommonResponseDto) }, // "#/components/schemas/CommonResponseDto"
    {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '성공적으로 응답되었습니다.' },
        error: { nullable: true, example: null },
        data: dataSchema,
      },
    },
  ],
});

/**
 * 실패 응답 스키마를 공통 에러 포맷으로 구성합니다.
 * status/code/message는 예외 필터가 내려주는 error 객체의 기본 값을 문서화할 때 사용합니다.
 */
export const errorResponseSchema = (
  status: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string', example: code },
        message: { type: 'string', example: message },
        status: { type: 'number', example: status },
        details: {
          type: 'object',
          nullable: true,
          example: details ?? null,
        },
      },
      required: ['code', 'message', 'status'],
    },
    data: { nullable: true, example: null },
  },
  required: ['success', 'error', 'data'],
});
