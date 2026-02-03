/**
 * 백엔드 에러 코드에 따른 사용자 친화적 에러 메시지
 * 토스트 알림 등에서 사용됩니다.
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // ===== 인증(Auth) 관련 에러 =====
  ACCESS_TOKEN_EXPIRED: '액세스 토큰이 만료되었습니다. 다시 로그인해주세요.',
  REFRESH_TOKEN_EXPIRED: '리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.',
  INVALID_ACCESS_TOKEN: '유효하지 않은 액세스 토큰입니다. 다시 로그인해주세요.',
  INVALID_REFRESH_TOKEN:
    '유효하지 않은 리프레시 토큰입니다. 다시 로그인해주세요.',
  ACCESS_TOKEN_NOT_EXPIRED: '액세스 토큰이 아직 만료되지 않았습니다.',

  // ===== 회원(Member) 관련 에러 =====
  MEMBER_NOT_FOUND: '회원을 찾을 수 없습니다.',
  MEMBER_NICKNAME_DUPLICATE: '이미 사용 중인 닉네임입니다.',

  // ===== 프로젝트(Project) 관련 에러 =====
  PROJECT_NOT_FOUND: '프로젝트를 찾을 수 없습니다.',
  PROJECT_FORBIDDEN: '이 프로젝트에 대한 수정/삭제 권한이 없습니다.',
  THUMBNAIL_UPLOAD_NOT_FOUND: '썸네일 업로드 정보를 찾을 수 없습니다.',
  INVALID_THUMBNAIL_METADATA: '썸네일 업로드 메타데이터가 올바르지 않습니다.',
  THUMBNAIL_OWNERSHIP_MISMATCH: '본인이 업로드한 썸네일이 아닙니다.',
  REPOSITORY_QUERY_REQUIRED: 'repository 쿼리 파라미터가 필요합니다.',
  INVALID_REPOSITORY_URL: 'repositoryUrl 형식이 올바르지 않습니다.',
  GITHUB_APP_KEY_NOT_CONFIGURED:
    'GitHub 설정이 올바르지 않습니다. 관리자에게 문의하세요.',
  GITHUB_API_REQUEST_FAILED:
    'GitHub API 요청에 실패했습니다. 잠시 후 다시 시도해주세요.',

  // ===== 스토리(Story) 관련 에러 =====
  STORY_NOT_FOUND: '캠퍼들의 이야기를 찾을 수 없습니다.',
  STORY_ALREADY_LIKED: '이미 좋아요한 캠퍼들의 이야기입니다.',
  STORY_NOT_LIKED: '좋아요하지 않은 캠퍼들의 이야기입니다.',

  // ===== 피드(Feed) 관련 에러 =====
  FEED_NOT_FOUND: '피드를 찾을 수 없습니다.',
  FEED_FORBIDDEN: '이 피드에 대한 권한이 없습니다.',
  INVALID_FEED_URL:
    '유효하지 않은 피드 URL입니다. 올바른 RSS 피드 URL을 확인해주세요.',
  UNAUTHORIZED_COHORT:
    '캠퍼 인증이 완료된 수료자만 RSS 피드를 등록할 수 있습니다.',

  // ===== 질문(Question) 관련 에러 =====
  QUESTION_NOT_FOUND: '질문을 찾을 수 없습니다.',

  // ===== 답변(Answer) 관련 에러 =====
  // (현재 Answer 전용 예외는 없음)

  // ===== 데이터베이스(DB) 관련 에러 =====
  DB_CONNECTION_FAILED:
    '데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
  DB_QUERY_FAILED: '데이터베이스 쿼리 실행 중 오류가 발생했습니다.',
  DB_TRANSACTION_FAILED: '트랜잭션 처리 중 오류가 발생했습니다.',

  // ===== 기본/공통 에러 메시지 =====
  INTERNAL_SERVER_ERROR:
    '서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
  SERVER_ERROR: '서버에 오류가 발생했습니다.',
};
