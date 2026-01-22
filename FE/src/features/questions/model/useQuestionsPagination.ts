import { fetchQuestionsByCursor } from '@/features/questions/api/questions.api';
import { Question } from '@/features/questions/model';
import { Meta } from '@/shared/types/PaginationType';
import { useEffect, useState } from 'react';

interface UseQuestionPaginationProps {
  initialQuestions: Question[];
  initialMeta: Meta;
}

export const useQuestionPagination = ({
  initialQuestions,
  initialMeta,
}: UseQuestionPaginationProps) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [meta, setMeta] = useState<Meta>(initialMeta);
  const [isLoading, setIsLoading] = useState(false);

  const [cursorHistory, setCursorHistory] = useState<
    (Base64URLString | null)[]
  >([null]);

  useEffect(() => {
    setQuestions(initialQuestions);
    setMeta(initialMeta);
    setCursorHistory([null]);
  }, [initialQuestions, initialMeta]);

  const handleNext = async () => {
    if (!meta.hasNext || isLoading) return;

    try {
      setIsLoading(true);
      const nextCursor = meta.nextCursor;

      const data = await fetchQuestionsByCursor(nextCursor);

      setQuestions(data.items);
      setMeta(data.meta);
      setCursorHistory((prev) => [...prev, nextCursor]);
    } catch (error) {
      if (error instanceof Error)
        Error('Failed to fetch next questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = async () => {
    if (cursorHistory.length <= 1 || isLoading) return;

    try {
      setIsLoading(true);

      const prevCursorToLoad = cursorHistory[cursorHistory.length - 2];

      const data = await fetchQuestionsByCursor(prevCursorToLoad);

      setQuestions(data.items);
      setMeta(data.meta);
      setCursorHistory((prev) => prev.slice(0, -1));
    } catch (error) {
      if (error instanceof Error)
        Error('Failed to fetch previous questions:', error);
    } finally {
      setIsLoading(false);
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
