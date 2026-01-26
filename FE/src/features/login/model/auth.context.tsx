'use client';

import {
  createContext,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentMember, logout as logoutApi } from '../api/auth.api';
import type { AuthContextType, Member } from './auth.types';

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * 인증 상태를 제공하는 Provider 컴포넌트
 *
 * 웹페이지 접속 시 쿠키의 accessToken을 확인하고,
 * 존재하면 /api/auth/me로 멤버 정보를 가져와 전역 상태로 관리합니다.
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {ReactNode} props.children - Provider의 자식 컴포넌트
 * @returns {JSX.Element} AuthContext.Provider로 감싸진 컴포넌트
 *
 * @example
 * // 사용 방법
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 현재 멤버 정보를 가져옵니다.
   */
  const fetchCurrentMember = useCallback(async () => {
    try {
      setIsLoading(true);
      const memberData = await getCurrentMember();
      setMember(memberData);
    } catch (error) {
      setMember(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 로그아웃 처리
   * 서버에 로그아웃 요청을 보내고 멤버 정보를 초기화한 후 메인 페이지로 리다이렉트합니다.
   */
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setMember(null);
      router.push('/');
    }
  }, [router]);

  /**
   * 컴포넌트 마운트 시 멤버 정보 로드
   */
  useEffect(() => {
    void fetchCurrentMember();
  }, [fetchCurrentMember]);

  /**
   * Context에 전달할 value 객체
   * useMemo를 통해 의존성이 변경될 때만 새로 생성됩니다.
   */
  const value = useMemo<AuthContextType>(
    () => ({
      member,
      isLoading,
      isAuthenticated: member !== null,
      fetchCurrentMember,
      logout,
    }),
    [member, isLoading, fetchCurrentMember, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Auth Context를 사용하기 위한 커스텀 훅
 *
 * AuthProvider 내에서만 사용 가능하며,
 * AuthProvider 밖에서 호출할 경우 에러를 발생시킵니다.
 *
 * @returns {AuthContextType} Auth Context 값 (멤버 정보와 인증 관련 함수 포함)
 * @throws {Error} AuthProvider로 감싸지 않은 경우 에러 발생
 *
 * @example
 * // 컴포넌트에서 사용
 * const { member, isAuthenticated, logout } = useAuth();
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
