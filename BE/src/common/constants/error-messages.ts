export const ERROR_MESSAGES = {
  // 공통
  API_NOT_FOUND: {
    code: 'API_NOT_FOUND',
    status: 404,
    message: '요청한 API 엔드포인트를 찾을 수 없습니다.',
  },

  PERMISSION_DENIED: {
    code: 'PERMISSION_DENIED',
    status: 403,
    message: '해당 리소스에 대한 권한이 없습니다.',
  },

  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    status: 500,
    message: '서버 내부 처리 중 예상치 못한 오류가 발생했습니다.',
  },

  // 데이터베이스
  DB_CONNECTION_FAILED: {
    code: 'DB_CONNECTION_FAILED',
    status: 500,
    message: '데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
  },

  DB_QUERY_FAILED: {
    code: 'DB_QUERY_FAILED',
    status: 500,
    message: '데이터베이스 쿼리 실행 중 오류가 발생했습니다.',
  },

  DB_TRANSACTION_FAILED: {
    code: 'DB_TRANSACTION_FAILED',
    status: 500,
    message: '트랜잭션 처리 중 오류가 발생했습니다.',
  },
};
