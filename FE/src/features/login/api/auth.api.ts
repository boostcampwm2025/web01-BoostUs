import { ApiResponse } from '@/shared/types/ApiResponseType';
import type { Member } from '../model/auth.types';

/**
 * 현재 로그인한 멤버 정보를 가져옵니다.
 * 쿠키의 accessToken을 사용하여 인증합니다.
 *
 * @returns {Promise<Member>} 멤버 정보
 * @throws {Error} 401 인증 에러는 'UNAUTHORIZED'로 변환, 다른 에러는 그대로 throw
 */
export async function getCurrentMember(): Promise<Member> {
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
  });

  if (response.ok) {
    const data = (await response.json()) as ApiResponse<Member>;
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
  await fetch('/api/auth/logout', {
    method: 'GET',
    credentials: 'include',
  });
}
