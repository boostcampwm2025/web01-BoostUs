import { ApiResponse } from '@/shared/types/ApiResponseType';
import { customFetch } from '@/shared/utils/fetcher';
import type { Member } from '../model/auth.types';

/**
 * 현재 로그인한 멤버 정보를 가져옵니다.
 * 쿠키의 accessToken을 사용하여 인증합니다.
 *
 * @returns {Promise<Member>} 멤버 정보
 * @throws {Error} 인증 실패 또는 네트워크 에러 시
 */
export async function getCurrentMember(): Promise<Member> {
  const data = await customFetch<ApiResponse<Member>>('/api/auth/me', {
    method: 'GET',
    credentials: 'include', // 쿠키 포함
  });
  return data.data;
}
