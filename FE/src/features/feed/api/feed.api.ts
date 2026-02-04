import { ApiResponse } from '@/shared/types/ApiResponseType';
import { customFetch } from '@/shared/utils/fetcher';

export interface FeedDetail {
  id: number;
  feedUrl: string;
  memberId: number;
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

export const deleteFeed = async (id: number) => {
  const response = await customFetch<ApiResponse<null>>(
    `/api/feeds/${id.toString()}`,
    {
      method: 'DELETE',
    }
  );

  return response.data;
};
