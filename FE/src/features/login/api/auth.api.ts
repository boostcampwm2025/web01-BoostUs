import { ApiResponse } from '@/shared/types/ApiResponseType';
import type { AuthResponse } from '../model/auth.types';

/**
 * 현재 로그인한 멤버 정보를 가져옵니다.
 * 쿠키의 accessToken을 사용하여 인증합니다.
 *
 * @returns {Promise<Member>} 멤버 정보
 * @throws {Error} 401 인증 에러는 'UNAUTHORIZED'로 변환, 다른 에러는 그대로 throw
 */
export async function getCurrentMember(): Promise<AuthResponse> {
  const response = await fetch('/api/members/me/profile', {
    method: 'GET',
    credentials: 'include',
    headers: { 'x-proxied-by': 'next' },
  });

  if (response.ok) {
    const data = (await response.json()) as ApiResponse<AuthResponse>;
    return data.data;
  }

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED');
  }

  throw new Error(`API Error: ${response.statusText}`);
}

/**
 * 로그아웃합니다.
 * 서버의 쿠키를 삭제합니다.
 */
export async function logout(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: { 'x-proxied-by': 'next' },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
}
