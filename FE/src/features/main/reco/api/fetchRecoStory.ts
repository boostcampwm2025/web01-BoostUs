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
  query?: string;
  cursor?: string;
  size?: number;
}

export const fetchRecoStory = async (params?: FetchStoriesParams) => {
  const queryParams = new URLSearchParams();

  if (params?.sortBy) queryParams.append('sortBy', params.sortBy.toUpperCase());
  if (params?.period) queryParams.append('period', params.period.toUpperCase());
  if (params?.query) queryParams.append('query', params.query);
  if (params?.cursor) queryParams.append('cursor', params.cursor);
  if (params?.size) queryParams.append('size', params.size.toString());

  const data = await customFetch<
    ApiResponse<{
      items: Story[];
      meta: Meta;
    }>
  >(`/api/stories?${queryParams.toString()}`);

  return data;
};
