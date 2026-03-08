'use client';

import {
  StoriesRankingPeriods,
  StoriesSortOption,
} from '@/features/stories/model/stories.type';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';

export interface StoriesFilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: StoriesSortOption['sortBy'];
  setSortBy: (option: StoriesSortOption['sortBy']) => void;
  period: StoriesSortOption['period'];
  setPeriod: (period: StoriesSortOption['period']) => void;
  rankingPeriod: StoriesRankingPeriods;
  setRankingPeriod: (period: StoriesRankingPeriods) => void;
}

const StoriesFilterContext = createContext<StoriesFilterContextType | null>(
  null
);

export const StoriesFilterProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('query') ?? '';
  const sortBy = (searchParams.get('sortBy') ??
    'latest') as StoriesSortOption['sortBy'];
  const period = (searchParams.get('period') ??
    'all') as StoriesSortOption['period'];
  const rankingPeriod = (searchParams.get('rankingPeriod') ??
    'weekly') as StoriesRankingPeriods;

  /**
   * 하나 이상의 URL 파라미터를 한 번에 업데이트한다.
   * value가 null이면 해당 파라미터를 제거하고, 빈 문자열이면 동일하게 제거한다.
   */
  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      }
      router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery: (query: string) => updateUrl({ query }),
      sortBy,
      setSortBy: (option: StoriesSortOption['sortBy']) =>
        updateUrl({
          sortBy: option,
          // 최신순으로 바꾸면 period 파라미터 제거
          ...(option === 'latest' && { period: null }),
        }),
      period,
      setPeriod: (period: StoriesSortOption['period']) => updateUrl({ period }),
      rankingPeriod,
      setRankingPeriod: (rankingPeriod: StoriesRankingPeriods) =>
        updateUrl({ rankingPeriod }),
    }),
    [searchQuery, sortBy, period, rankingPeriod, updateUrl]
  );

  return (
    <StoriesFilterContext.Provider value={value}>
      {children}
    </StoriesFilterContext.Provider>
  );
};

export const useStoriesFilterContext = (): StoriesFilterContextType => {
  const context = useContext(StoriesFilterContext);
  if (!context) {
    throw new Error(
      'useStoriesFilterContext must be used within a StoriesFilterProvider'
    );
  }
  return context;
};
