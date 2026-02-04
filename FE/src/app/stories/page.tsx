import { StoriesPageContent, StoriesSortOption } from '@/features/stories';
import { fetchStories } from '@/features/stories/api/stories.api';

// 크롤러가 긁어오는 데이터는 사용자가 제어 불가능 -> 굳이 On-demand 안해도 됨
export const revalidate = 3600;

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
