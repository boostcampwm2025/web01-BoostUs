import { fetchStories } from '@/features/stories/api/stories.api';
import StoriesPageContent from '@/features/stories/ui/StoriesPageContent';
import { StoriesSortOption } from '@/features/stories/model/stories.type';

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

  return <StoriesPageContent initialStories={initialStories} />;
};

export default StoriesPage;
