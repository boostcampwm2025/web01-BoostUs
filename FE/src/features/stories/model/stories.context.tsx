'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface StoriesContextType {
  // UI 상태 (메모리 저장)
  isRankingOpen: boolean; // 랭킹 섹션 열림/닫힘 여부
  toggleRanking: () => void; // 랭킹 섹션 토글 함수

  // 데이터 상태 (쿼리 파라미터 저장)
  searchQuery: string; // 검색어 (검색바 값)
  setSearchQuery: (query: string) => void; // 검색어 설정 함수
  sortOption: string; // 정렬 옵션
  setSortOption: (option: string) => void; // 정렬 옵션 설정 함수
  rankingPeriod: string; // 랭킹 기간
  setRankingPeriod: (period: string) => void; // 랭킹 기간 설정 함수
}

const StoriesContext = createContext<StoriesContextType | null>(null);

export const StoriesProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // UI 상태
  const [isRankingOpen, setIsRankingOpen] = useState(true);
  const toggleRanking = () => setIsRankingOpen((prev) => !prev);

  // 데이터 상태
  const searchQuery = searchParams.get('q') ?? '';
  const sortOption = searchParams.get('sort') ?? 'latest';
  const rankingPeriod = searchParams.get('period') ?? 'weekly';

  // URL 업데이트 헬퍼 함수
  const updateUrl = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const value = useMemo(
    () => ({
      isRankingOpen,
      toggleRanking,
      searchQuery,
      setSearchQuery: (query: string) => updateUrl('q', query),
      sortOption,
      setSortOption: (option: string) => updateUrl('sort', option),
      rankingPeriod,
      setRankingPeriod: (period: string) => updateUrl('period', period),
    }),
    [isRankingOpen, searchQuery, sortOption, rankingPeriod, updateUrl]
  );

  return (
    <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>
  );
};

export const useStoriesContext = () => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error('useStoriesContext must be used within a StoriesProvider');
  }
  return context;
};
