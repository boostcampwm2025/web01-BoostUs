import { StoriesResponse } from '@/features/stories/model/stories.type';

export const fetchStories = async (): Promise<StoriesResponse> => {
  const response = await fetch(
    `${process.env.INTERNAL_API_URL ?? 'http://backend:3000'}/stories`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }

  const data = (await response.json()) as StoriesResponse;

  return data;
};
