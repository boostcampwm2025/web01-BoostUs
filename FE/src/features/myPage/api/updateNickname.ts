import { ApiResponse } from '@/shared/types/ApiResponseType';
import { customFetch } from '@/shared/utils/fetcher';

export async function updateNickname(nickname: string) {
  await customFetch<ApiResponse<unknown>>('/api/members/me/profile/nickname', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname }),
    credentials: 'include',
  });
}
