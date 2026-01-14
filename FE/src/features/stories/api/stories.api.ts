import {
  StoriesResponse,
  StoriesSortOption,
} from '@/features/stories/model/stories.type';

interface FetchStoriesParams {
  sortBy?: StoriesSortOption['sortBy'];
  period?: StoriesSortOption['period'];
}

export const fetchStories = async (
  params?: FetchStoriesParams
): Promise<StoriesResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params?.period) {
    queryParams.append('period', params.period);
  }

  const queryString = queryParams.toString();
  const url = `${process.env.INTERNAL_API_URL ?? 'http://backend:3000'}/stories${
    queryString ? `?${queryString}` : ''
  }`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }

  const data = (await response.json()) as StoriesResponse;

  return data;
};
