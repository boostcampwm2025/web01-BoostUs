import { StoriesPageContent, StoriesSortOption } from '@/features/stories';
import { fetchStories } from '@/features/stories/api/stories.api';
import { Suspense } from 'react';

interface StoriesPageProps {
  searchParams: Promise<{
    sortBy?: StoriesSortOption['sortBy'];
    period?: StoriesSortOption['period'];
  }>;
}

const StoriesPage = async ({ searchParams }: StoriesPageProps) => {
  const params = await searchParams;
  const response = await fetchStories({
    sortBy: params.sortBy ?? 'latest',
    period: params.period ?? 'all',
  });
  const initialStories = response.data.items;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoriesPageContent initialStories={initialStories} />
    </Suspense>
  );

export default StoriesPage;
