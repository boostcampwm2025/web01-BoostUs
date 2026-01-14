import { StoriesResponse } from '@/features/stories/model/stories.type';

export const fetchStories = async (): Promise<StoriesResponse> => {
  const response = await fetch('http://localhost:3000/stories');

  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }

  const data = (await response.json()) as StoriesResponse;

  return data;
};
