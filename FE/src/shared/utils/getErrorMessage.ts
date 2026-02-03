export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }

  return '알 수 없는 오류가 발생했습니다.';
};

// TODO: 향후 필요 시 에러 코드별 메시지 매핑 로직 추가 고려
