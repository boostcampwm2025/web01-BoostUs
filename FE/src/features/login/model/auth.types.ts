/**
 * 멤버 정보 타입
 * 백엔드 MemberDto와 일치
 */
export interface Member {
  id: string; // bigint는 JSON에서 string으로 직렬화됨
  nickname: string;
  avatarUrl: string | null;
  cohort: number | null;
}

/**
 * AuthContext의 타입 정의
 */
export interface AuthContextType {
  member: Member | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchCurrentMember: () => Promise<void>;
  logout: () => void;
}
