import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCurrentMember,
  logout as logoutApi,
} from '@/features/login/api/auth.api'; // 기존 API 그대로 사용
import type { AuthResponse } from './auth.types'; // 기존 타입 그대로 사용

// 상태 정의 memberAtom: 로그인한 사용자 정보 (초기값 null)
export const memberAtom = atom<AuthResponse | null>(null);

// authLoadingAtom: 로딩 상태 (초기값 true - 첫 로드 시 깜빡임 방지)
export const authLoadingAtom = atom<boolean>(true);

// isAuthenticatedAtom: 로그인 여부를 판단하는 파생 Atom (읽기 전용)
export const isAuthenticatedAtom = atom((get) => get(memberAtom) !== null);

// 로직 정의
export const useAuth = () => {
  const [member, setMember] = useAtom(memberAtom);
  const [isLoading, setIsLoading] = useAtom(authLoadingAtom);
  const router = useRouter();

  // 사용자 정보 가져오기
  const fetchCurrentMember = useCallback(async () => {
    try {
      setIsLoading(true);
      const memberData = await getCurrentMember();
      setMember(memberData);
    } catch (error) {
      // TODO: 401 등 에러 발생 시 로그인 안 된 상태로 처리
      console.log('API 오류 발생:', error);
      setMember(null);
    } finally {
      setIsLoading(false);
    }
  }, [setMember, setIsLoading]);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setMember(null);
      router.push('/'); // 로그아웃 후 메인으로 이동
    }
  }, [setMember, router]);

  return {
    member,
    isLoading,
    isAuthenticated: member !== null,
    fetchCurrentMember,
    logout,
  };
};
