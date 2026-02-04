/**
 * 멤버 정보 타입
 * 백엔드 MemberDto와 일치
 */
export interface Member {
  id: string; // bigint는 JSON에서 string으로 직렬화됨
  githubLogin: string | null;
  avatarUrl: string | null;
  nickname: string;
  cohort: number | null;
  role?: 'MEMBER' | 'ADMIN';
}
export interface latestProject {
  title: string;
  teamName: string;
  field: string;
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

export interface AuthResponse {
  member: Member;
  latestProject: {
    title: string;
    teamName: string;
    field: string;
  } | null;
  feed: {
    id: number;
    feedUrl: string;
  } | null;
}
