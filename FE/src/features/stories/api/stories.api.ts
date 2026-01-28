import {
  StoriesSortOption,
  Story,
  StoryDetail,
} from '@/features/stories/model/stories.type';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { Meta } from '@/shared/types/PaginationType';
import { customFetch } from '@/shared/utils/fetcher';

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
export const fetchStories = async (params?: FetchStoriesParams) => {
  return await customFetch<
    ApiResponse<{
      items: Story[];
      meta: Meta;
    }>
  >('/api/stories', { params: { ...params } });
};

/**
 * 특정 블로그 글 상세 조회
 * @param id 블로그 글 ID
 * **/
export const getStoryById = async (id: string) => {
  return await customFetch<ApiResponse<StoryDetail>>(`/api/stories/${id}`);
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
