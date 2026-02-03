import { ApiError } from '@/shared/utils/fetcher';
import { ERROR_MESSAGES } from '@/shared/constants/errorMessages';

export const getErrorMessage = (error: unknown): string => {
  // 1. 문자열로 에러가 들어온 경우 (예: 간단한 유효성 검사 등)
  if (typeof error === 'string') {
    return error;
  }

  // 2. 백엔드 API 에러인 경우
  if (error instanceof ApiError) {
    if (error.code && ERROR_MESSAGES[error.code]) {
      return ERROR_MESSAGES[error.code];
    }

    // 매핑된 메시지는 없지만, 서버에서 보내준 메시지가 있다면 사용
    // (백엔드 UnknownFilter에서 500 에러 등의 보안 정보는 이미 걸러졌다고 가정)
    if (error.message) {
      return error.message;
    }
  }

  // 3. 일반 JavaScript Error 객체인 경우 (코드 런타임 에러 등)
  if (error instanceof Error) {
    return error.message;
  }

  // 4. message 속성을 가진 알 수 없는 객체인 경우
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }

  // 5. 최후의 수단: 기본 에러 메시지
  return ERROR_MESSAGES.UNKNOWN_ERROR || '알 수 없는 오류가 발생했습니다.';
};
