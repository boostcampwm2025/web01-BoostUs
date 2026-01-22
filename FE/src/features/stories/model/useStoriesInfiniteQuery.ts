import { fetchStories } from '@/features/stories/api/stories.api';
import { StoriesSortOption } from '@/features/stories/model/stories.type';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseStoriesInfiniteQueryParams {
  sortBy: StoriesSortOption['sortBy'];
  period: StoriesSortOption['period'];
  searchQuery?: string;
}

export const useStoriesInfiniteQuery = ({
  sortBy,
  period,
  searchQuery,
}: UseStoriesInfiniteQueryParams) => {
  return useInfiniteQuery({
    // 이 키가 변하면 자동으로 데이터를 새로고침(refetch)
    queryKey: ['stories', sortBy, period, searchQuery],

    // 실제 데이터를 가져오는 함수
    queryFn: ({ pageParam }) =>
      fetchStories({
        sortBy,
        period,
        query: searchQuery,
        cursor: pageParam,
      }),

    // 첫 요청 시 pageParam의 초기값
    initialPageParam: undefined as string | undefined,

    // 다음 페이지를 불러올 때 사용할 커서를 결정
    getNextPageParam: (lastPage) => {
      const hasNext =
        lastPage.data.meta.hasNextPage ?? lastPage.data.meta.hasNext;
      if (!hasNext) return undefined;
      return lastPage.data.meta.nextCursor ?? undefined;
    },
  });
};
