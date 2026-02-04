import {
  fetchQuestionsByCursor,
  QUESTIONS_KEY,
} from '@/features/questions/api/questions.api';
import { Question } from '@/features/questions/model';
import { Meta } from '@/shared/types/PaginationType';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

interface UseQuestionPaginationProps {
  initialQuestions: Question[];
  initialMeta: Meta;
}

export const useQuestionPagination = ({
  initialQuestions,
  initialMeta,
}: UseQuestionPaginationProps) => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // URL 쿼리 파라미터 추출
  const status = searchParams.get('status') ?? 'all';
  const sort = searchParams.get('sort') ?? 'latest';
  const query = searchParams.get('query') ?? '';

  // 커서 히스토리 관리 (페이지네이션 UI 유지를 위해 필요)
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCursorHistory([null]);
  }, [status, sort, query]);

  // 현재 페이지의 커서 (배열의 마지막 요소)
  const currentCursor = cursorHistory[cursorHistory.length - 1];

  const { data, isLoading } = useQuery({
    queryKey: QUESTIONS_KEY.list({
      status,
      sort,
      query,
      cursor: currentCursor,
    }),
    queryFn: () =>
      fetchQuestionsByCursor({ status, sort, query, cursor: currentCursor }),
    // 첫 페이지(cursor가 null)일 때만 초기 데이터(ISR/SSR 데이터) 사용
    initialData:
      currentCursor === null
        ? { items: initialQuestions, meta: initialMeta }
        : undefined,
    // 이전 데이터 유지 (깜빡임 방지)
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
  });

  const questions = data?.items ?? [];
  const meta = data?.meta ?? { hasNext: false, nextCursor: null, count: 0 };

  // 다음 페이지 미리 가져오기 (Prefetching) - UX 향상
  useEffect(() => {
    if (meta.hasNext && meta.nextCursor) {
      const nextParams = { status, sort, query, cursor: meta.nextCursor };
      void queryClient.prefetchQuery({
        queryKey: QUESTIONS_KEY.list(nextParams),
        queryFn: () => fetchQuestionsByCursor(nextParams),
      });
    }
  }, [meta.hasNext, meta.nextCursor, status, sort, query, queryClient]);

  const handleNext = () => {
    if (meta.hasNext && meta.nextCursor) {
      setCursorHistory((prev) => [...prev, meta.nextCursor]);
    }
  };

  const handlePrev = () => {
    if (cursorHistory.length > 1) {
      setCursorHistory((prev) => prev.slice(0, -1));
    }
  };

  return {
    questions,
    meta,
    isLoading,
    currentPage: cursorHistory.length,
    hasNext: meta.hasNext,
    hasPrev: cursorHistory.length > 1,
    handleNext,
    handlePrev,
  };
};
