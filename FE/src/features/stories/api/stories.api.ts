import {
  StoriesResponse,
  StoriesSortOption,
  StoryDetailResponse,
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

  const isServerComponent = typeof window === 'undefined';

  const baseUrl = isServerComponent
    ? (process.env.INTERNAL_API_URL ?? 'http://backend:3000') // 서버 환경 (Docker 내부)
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'); // 클라이언트 환경 (브라우저)

  const queryString = queryParams.toString();
  const url = `${baseUrl}/stories${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }

  const data = (await response.json()) as StoriesResponse;

  return data;
};

export const getStoryById = async (id: string) => {
  const isServerComponent = typeof window === 'undefined';

  const baseUrl = isServerComponent
    ? (process.env.INTERNAL_API_URL ?? 'http://backend:3000') // 서버 환경 (Docker 내부)
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'); // 클라이언트 환경 (브라우저)

  const url = `${baseUrl}/stories/${id}`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch story by ID');
  }

  const data = (await response.json()) as StoryDetailResponse;

  return data;
};
