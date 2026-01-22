import {
  StoriesSortOption,
  Story,
} from '@/features/stories/model/stories.type';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { Meta } from '@/shared/types/PaginationType';
import { customFetch } from '@/shared/utils/fetcher';

interface FetchStoriesParams {
  sortBy?: StoriesSortOption['sortBy'];
  period?: StoriesSortOption['period'];
}

export const fetchStories = async (params?: FetchStoriesParams) => {
  const queryParams = new URLSearchParams();

  if (params?.sortBy) {
    queryParams.append('sortBy', params.sortBy.toUpperCase());
  }
  if (params?.period) {
    queryParams.append('period', params.period.toUpperCase());
  }

  const data = await customFetch<
    ApiResponse<{
      items: Story[];
      meta: Meta;
    }>
  >(`/api/stories?${queryParams.toString()}`);

  return data;
};

export const getStoryById = async (id: string) => {
  const data = await customFetch<ApiResponse<Story>>(`/api/stories/${id}`);

  return data;
};
