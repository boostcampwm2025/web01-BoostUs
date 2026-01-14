import { fetchStories } from '@/features/stories/api/stories.api';
import StoriesPageContent from '@/features/stories/ui/StoriesPageContent';
import { StoriesSortOption } from '@/features/stories/model/stories.type';

interface StoriesPageProps {
  searchParams: Promise<{
    sortBy?: string;
    period?: string;
  }>;
}

const StoriesPage = async ({ searchParams }: StoriesPageProps) => {
  const params = await searchParams;
  const response = await fetchStories({
    sortBy: params.sortBy as StoriesSortOption['sortBy'],
    period: params.period as StoriesSortOption['period'],
  });
  const initialStories = response.data.items;

  return <StoriesPageContent initialStories={initialStories} />;
};

export default StoriesPage;
