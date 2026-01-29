'use client';

import {
  QuestionsSortBy,
  QuestionsStatusFilter,
} from '@/features/questions/model';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  createContext,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';

/**
 * Questions 페이지의 전역 상태 관리를 위한 Context 타입
 *
 * @interface QuestionsContextType
 * @property {QuestionsStatusFilter} status - 질문 상태 필터 파라미터 (기본값: 'all')
 * @property {(status: QuestionsStatusFilter) => void} setStatus - 질문 상태 필터 설정 함수
 * @property {string} searchQuery - 검색 쿼리 파라미터 (URL의 q 파라미터)
 * @property {(query: string) => void} setSearchQuery - 검색 쿼리 설정 함수
 */
interface QuestionsContextType {
  status: QuestionsStatusFilter;
  setStatus: (status: QuestionsStatusFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sort: QuestionsSortBy;
  setSort: (sort: QuestionsSortBy) => void;
}

const QuestionsContext = createContext<QuestionsContextType | null>(null);

/**
 * Questions 페이지의 전역 상태를 제공하는 Provider 컴포넌트
 *
 * 필터링, 검색 등의 상태를 관리하며,
 * URL 쿼리 파라미터와 동기화되어 페이지 새로고침 시에도 상태가 유지됩니다.
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {ReactNode} props.children - Provider의 자식 컴포넌트
 * @returns {JSX.Element} QuestionsContext.Provider로 감싸진 컴포넌트
 *
 * @example
 * // 사용 방법
 * <QuestionsProvider>
 *   <QuestionsPage />
 * </QuestionsProvider>
 */
export const QuestionsProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = (searchParams.get('status') ?? 'all') as QuestionsStatusFilter;
  const searchQuery = searchParams.get('query') ?? '';
  const sort = (searchParams.get('sort') ?? 'latest') as QuestionsSortBy;

  /**
   * URL의 쿼리 파라미터를 업데이트하는 헬퍼 함수
   *
   * 주어진 key-value 쌍으로 URL 파라미터를 업데이트하고,
   * 값이 빈 문자열인 경우 해당 파라미터를 제거합니다.
   *
   * @param {string} key - URL 파라미터의 키 (예: 'status', 'query')
   * @param {string} value - URL 파라미터의 값
   *
   * @example
   * updateUrl('status', 'solved');  // URL을 ?status=solved로 업데이트
   * updateUrl('query', '');         // query 파라미터 제거
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
      status,
      setStatus: (newStatus: QuestionsStatusFilter) =>
        updateUrl('status', newStatus),
      searchQuery,
      setSearchQuery: (query: string) => updateUrl('query', query),
      sort,
      setSort: (newSort: QuestionsSortBy) => updateUrl('sort', newSort),
    }),
    [status, searchQuery, sort, updateUrl]
  );

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};

/**
 * Questions Context를 사용하기 위한 커스텀 훅
 *
 * QuestionsProvider 내에서만 사용 가능하며,
 * QuestionsProvider 밖에서 호출할 경우 에러를 발생시킵니다.
 *
 * @returns {QuestionsContextType} Questions Context 값 (상태와 상태 관리 함수 포함)
 * @throws {Error} QuestionsProvider로 감싸지 않은 경우 에러 발생
 *
 * @example
 * // 컴포넌트에서 사용
 * const { status, setStatus, searchQuery, setSearchQuery } = useQuestionsContext();
 */
export const useQuestionsContext = (): QuestionsContextType => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error(
      'useQuestionsContext must be used within a QuestionsProvider'
    );
  }
  return context;
};
