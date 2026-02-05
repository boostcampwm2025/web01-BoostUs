import { ApiResponse } from '@/shared/types/ApiResponseType';
import { customFetch } from '@/shared/utils/fetcher';

export interface FeedDetail {
  id: string;
  feedUrl: string;
  memberId: string;
  state: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  lastFetchedAt: string | null;
}

export const getMyFeed = async () => {
  return await customFetch<ApiResponse<FeedDetail | null>>('/api/feeds/me', {
    cache: 'no-store',
  });
};

export const createOrUpdateFeed = async (body: { feedUrl: string }) => {
  const response = await customFetch<ApiResponse<FeedDetail>>('/api/feeds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response.data;
};

export const deleteFeed = async (id: string) => {
  const response = await customFetch<ApiResponse<null>>(`/api/feeds/${id}`, {
    method: 'DELETE',
  });

  return response.data;
};
