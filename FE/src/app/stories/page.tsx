import { StoriesPageContent, StoriesSortOption } from '@/features/stories';
import { fetchStories, STORIES_KEY } from '@/features/stories/api/stories.api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

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
  const sortBy = params.sortBy ?? 'latest';
  const period = params.period ?? 'all';

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: STORIES_KEY.list(sortBy, period),
    queryFn: () => fetchStories({ sortBy, period }),
    initialPageParam: undefined as string | undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoriesPageContent />
    </HydrationBoundary>
  );
};

export default StoriesPage;
