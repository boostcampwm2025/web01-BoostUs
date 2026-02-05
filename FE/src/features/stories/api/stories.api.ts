import {
  StoriesSortOption,
  Story,
  StoryDetail,
} from '@/features/stories/model/stories.type';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { Meta } from '@/shared/types/PaginationType';
import { customFetch } from '@/shared/utils/fetcher';

export const STORIES_KEY = {
  all: ['stories'] as const,
  detail: (id: string) => [...STORIES_KEY.all, 'detail', id] as const,
  likeStatus: (id: string) =>
    [...STORIES_KEY.detail(id), 'likeStatus'] as const,
};

interface FetchStoriesParams {
  sortBy?: StoriesSortOption['sortBy'];
  period?: StoriesSortOption['period'];
  query?: string;
  cursor?: string;
  size?: number;
}

/**
 * 블로그 글 목록 조회
 */
export const fetchStories = async (
  params?: FetchStoriesParams,
  options?: {
    skipStore?: boolean;
  }
) => {
  return await customFetch<
    ApiResponse<{
      items: Story[];
      meta: Meta;
    }>
  >('/api/stories', { ...options, params: { ...params } });
};

/**
 * 특정 블로그 글 상세 조회
 * @param id 블로그 글 ID
 * **/
export const getStoryById = async (id: string) => {
  return await customFetch<ApiResponse<StoryDetail>>(`/api/stories/${id}`);
};

/**
 * 스토리 조회수 증가 (bid 쿠키 기반, 클라이언트에서 호출)
 * @param storyId 스토리 ID
 */
export const incrementStoryView = async (storyId: string): Promise<void> => {
  await customFetch<ApiResponse<void>>(`/api/stories/${storyId}/view`, {
    method: 'POST',
  });
};

/**
 * 캠퍼들의 이야기 좋아요 등록
 * @param storyId 스토리 ID
 */
export const likeStory = async (storyId: string) => {
  const data = await customFetch<ApiResponse<{ storyId: string }>>(
    `/api/stories/${storyId}/like`,
    {
      method: 'POST',
    }
  );

  return data.data;
};

/**
 * 캠퍼들의 이야기 좋아요 취소
 * @param storyId 스토리 ID
 */
export const unlikeStory = async (storyId: string) => {
  const data = await customFetch<ApiResponse<{ storyId: string }>>(
    `/api/stories/${storyId}/like`,
    {
      method: 'DELETE',
    }
  );

  return data.data;
};

/**
 * 캠퍼들의 이야기 좋아요 상태 확인
 * @param storyId 스토리 ID
 * @returns 좋아요 여부
 */
export const checkStoryLikeStatus = async (
  storyId: string
): Promise<boolean> => {
  const data = await customFetch<ApiResponse<{ isLiked: boolean }>>(
    `/api/stories/${storyId}/like/status`
  );

  return data.data.isLiked;
};
