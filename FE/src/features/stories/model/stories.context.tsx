'use client';

import {
  StoriesRankingPeriods,
  StoriesSortOption,
} from '@/features/stories/model/stories.type';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  createContext,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/**
 * Stories 페이지의 전역 상태 관리를 위한 Context 타입
 *
 * @interface StoriesContextType
 * @property {boolean} isRankingOpen - 랭킹 섹션의 열림/닫힘 상태
 * @property {() => void} toggleRanking - 랭킹 섹션 토글 함수
 * @property {StoriesRankingPeriods} rankingPeriod - 랭킹 기간 파라미터 (기본값: 'weekly')
 * @property {(period: StoriesRankingPeriods) => void} setRankingPeriod - 랭킹 기간 설정 함수
 * @property {string} searchQuery - 검색 쿼리 파라미터 (URL의 q 파라미터)
 * @property {(query: string) => void} setSearchQuery - 검색 쿼리 설정 함수
 * @property {StoriesSortOption['sortBy']} sortBy - 정렬 옵션 파라미터 (기본값: 'latest')
 * @property {(option: StoriesSortOption['sortBy']) => void} setSortBy - 정렬 옵션 설정 함수
 * @property {StoriesSortOption['period']} period - 시간 기간 필터 파라미터 (기본값: 'all')
 * @property {(period: StoriesSortOption['period']) => void} setPeriod - 시간 기간 설정 함수
 */
interface StoriesContextType {
  isRankingOpen: boolean;
  toggleRanking: () => void;
  rankingPeriod: StoriesRankingPeriods;
  setRankingPeriod: (period: StoriesRankingPeriods) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: StoriesSortOption['sortBy'];
  setSortBy: (option: StoriesSortOption['sortBy']) => void;
  period?: StoriesSortOption['period'];
  setPeriod: (period: StoriesSortOption['period']) => void;
}

const StoriesContext = createContext<StoriesContextType | null>(null);

/**
 * Stories 페이지의 전역 상태를 제공하는 Provider 컴포넌트
 *
 * 검색, 정렬, 랭킹 필터 등의 상태를 관리하며,
 * URL 쿼리 파라미터와 동기화되어 페이지 새로고침 시에도 상태가 유지됩니다.
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {ReactNode} props.children - Provider의 자식 컴포넌트
 * @returns {JSX.Element} StoriesContext.Provider로 감싸진 컴포넌트
 *
 * @example
 * // 사용 방법
 * <StoriesProvider>
 *   <StoriesPage />
 * </StoriesProvider>
 */
export const StoriesProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isRankingOpen, setIsRankingOpen] = useState(true);
  const toggleRanking = () => setIsRankingOpen((prev) => !prev);

  const rankingPeriod = (searchParams.get('rankingPeriod') ??
    'weekly') as StoriesRankingPeriods;
  const searchQuery = searchParams.get('q') ?? '';
  const sortBy = (searchParams.get('sortBy') ??
    'latest') as StoriesSortOption['sortBy'];

  const period = (searchParams.get('period') ??
    'all') as StoriesSortOption['period'];

  /**
   * URL의 쿼리 파라미터를 업데이트하는 헬퍼 함수
   *
   * 주어진 key-value 쌍으로 URL 파라미터를 업데이트하고,
   * 값이 빈 문자열인 경우 해당 파라미터를 제거합니다.
   *
   * @param {string} key - URL 파라미터의 키 (예: 'q', 'sortBy', 'period')
   * @param {string} value - URL 파라미터의 값
   *
   * @example
   * updateUrl('q', 'typescript'); // URL을 ?q=typescript로 업데이트
   * updateUrl('sortBy', '');        // sortBy 파라미터 제거
   */
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

  /**
   * Context에 전달할 value 객체
   * useMemo를 통해 의존성이 변경될 때만 새로 생성됩니다.
   */
  const value = useMemo(
    () => ({
      isRankingOpen,
      toggleRanking,
      searchQuery,
      setSearchQuery: (query: string) => updateUrl('q', query),
      sortBy,
      setSortBy: (option: StoriesSortOption['sortBy']) => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (option) {
          newParams.set('sortBy', option);
        } else {
          newParams.delete('sortBy');
        }

        if (option === 'latest') {
          newParams.delete('period');
        }

        router.push(`?${newParams.toString()}`, { scroll: false });
      },
      rankingPeriod,
      setRankingPeriod: (period: StoriesRankingPeriods) =>
        updateUrl('rankingPeriod', period),
      period,
      setPeriod: (period: StoriesSortOption['period']) =>
        updateUrl('period', period),
    }),
    [isRankingOpen, searchQuery, sortBy, rankingPeriod, period, updateUrl]
  );

  return (
    <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>
  );
};

/**
 * Stories Context를 사용하기 위한 커스텀 훅
 *
 * StoriesProvider 내에서만 사용 가능하며,
 * StoriesProvider 밖에서 호출할 경우 에러를 발생시킵니다.
 *
 * @returns {StoriesContextType} Stories Context 값 (상태와 상태 관리 함수 포함)
 * @throws {Error} StoriesProvider로 감싸지 않은 경우 에러 발생
 *
 * @example
 * // 컴포넌트에서 사용
 * const { searchQuery, setSearchQuery, sortOption, setSortOption } = useStoriesContext();
 */
export const useStoriesContext = (): StoriesContextType => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error('useStoriesContext must be used within a StoriesProvider');
  }
  return context;
};
