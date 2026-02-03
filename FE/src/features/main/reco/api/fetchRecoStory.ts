import {
  StoriesSortOption,
  Story,
} from '@/features/stories/model/stories.type';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { Meta } from '@/shared/types/PaginationType';
import { customFetch } from '@/shared/utils/fetcher';

export const FEED_QUERY_KEY = ['feed-stories'];
export const FEED_PARAMS = { sortBy: 'views', period: 'all', size: 8 } as const;

export const RECO_STORY_QUERY_KEY = ['reco-story-best'];
export const RECO_STORY_PARAMS = {
  sortBy: 'views',
  period: 'all',
  size: 1,
} as const;

interface FetchStoriesParams {
  sortBy?: StoriesSortOption['sortBy'];
  period?: StoriesSortOption['period'];
  query?: string;
  cursor?: string;
  size?: number;
}

export const fetchRecoStory = async (
  params?: FetchStoriesParams & { skipStore?: boolean }
) => {
  const { skipStore, ...apiParams } = params ?? {};
  return await customFetch<
    ApiResponse<{
      items: Story[];
      meta: Meta;
    }>
  >('/api/stories', {
    params: {
      ...apiParams,
      sortBy: apiParams?.sortBy?.toUpperCase(),
      period: apiParams?.period?.toUpperCase(),
    },
    skipStore,
  });
};
