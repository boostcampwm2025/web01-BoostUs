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
  const queryParams = new URLSearchParams();

  return await customFetch<
    ApiResponse<{
      items: Story[];
      meta: Meta;
    }>
  >(`/api/stories?${queryParams.toString()}`, { params: { ...params } });
};

/**
 * 특정 블로그 글 상세 조회
 * @param id 블로그 글 ID
 * **/
export const getStoryById = async (id: string) => {
  return await customFetch<ApiResponse<StoryDetail>>(`/api/stories/${id}`);
};
