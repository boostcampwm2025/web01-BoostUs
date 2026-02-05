import { ApiResponse } from '@/shared/types/ApiResponseType';
import { customFetch } from '@/shared/utils/fetcher';

export async function updateNickname(nickname: string) {
  await customFetch<ApiResponse<void>>('/api/members/me/profile/nickname', {
    method: 'PATCH',
    body: JSON.stringify({ nickname }),
    credentials: 'include',
  });
}
