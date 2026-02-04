import { StoriesPageContent, StoriesSortOption } from '@/features/stories';
import { fetchStories } from '@/features/stories/api/stories.api';
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

  // SSR 데이터를 React Query 캐시에 미리 채워넣음 (Prefetch)
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['stories', sortBy, period, undefined], // searchQuery는 초기엔 undefined
    queryFn: () => fetchStories({ sortBy, period }),
    initialPageParam: undefined as string | undefined,
  });

  return (
    // ✅ 클라이언트로 캐시 상태 전달 (Hydration)
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* props로 데이터를 넘길 필요가 없어짐 */}
      <StoriesPageContent />
    </HydrationBoundary>
  );
};

export default StoriesPage;
