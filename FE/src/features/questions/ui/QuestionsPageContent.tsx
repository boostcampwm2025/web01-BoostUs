'use client';

import { Question } from '@/features/questions/model/questions.type';
import { QuestionsProvider } from '@/features/questions/model';
import QuestionButton from '@/features/questions/ui/Button/QuestionButton';
import QuestionsHeader from '@/features/questions/ui/Header/Header';
import QuestionsList from '@/features/questions/ui/List/List';
import QuestionsSearchBar from '@/features/questions/ui/SearchBar/SearchBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Meta } from '@/shared/types/PaginationType';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { useState } from 'react';

const fetchQuestionsClient = async (cursor: Base64URLString | null) => {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor);

  const response = await fetch(`/api/questions?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch');

  const data = (await response.json()) as ApiResponse<{
    items: Question[];
    meta: Meta;
  }>;
  return data.data;
};

const QuestionsPageContent = ({
  initialQuestions,
  meta: initialMeta,
}: {
  initialQuestions: Question[];
  meta: Meta;
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [meta, setMeta] = useState<Meta>(initialMeta);
  const [isLoading, setIsLoading] = useState(false);

  const [cursorHistory, setCursorHistory] = useState<
    (Base64URLString | null)[]
  >([null]);

  const currentPage = cursorHistory.length;

  const handleNext = async () => {
    if (!meta.hasNext || isLoading) return;

    try {
      setIsLoading(true);
      const nextCursor = meta.nextCursor;

      const data = await fetchQuestionsClient(nextCursor);
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

      const data = await fetchQuestionsClient(prevCursorToLoad);
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

  return (
    <QuestionsProvider>
      <div className="flex flex-col w-full font-sans max-w-270">
        <QuestionsHeader />
        <div className="flex flex-row gap-4 mt-8">
          <QuestionsSearchBar />
          <QuestionButton />
        </div>
        <QuestionsList initialQuestions={questions} />
        <div className="flex flex-row items-center justify-center gap-2 mt-4">
          <button
            onClick={handlePrev}
            disabled={cursorHistory.length === 0 || isLoading}
            className={`flex flex-row cursor-pointer text-neutral-text-weak hover:text-neutral-text-strong ${
              cursorHistory.length > 1
                ? 'text-neutral-text-default'
                : 'cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronLeft strokeWidth={1} />
            <span>이전</span>
          </button>
          <span className="text-neutral-text-default text-string-16">
            {currentPage} 페이지
          </span>
          <button
            onClick={handleNext}
            disabled={!meta.hasNext || isLoading}
            className={`flex flex-row cursor-pointer text-neutral-text-weak hover:text-neutral-text-strong ${
              meta.hasNext
                ? 'text-neutral-text-default'
                : 'cursor-not-allowed opacity-50'
            }`}
          >
            <span>다음</span>
            <ChevronRight strokeWidth={1} />
          </button>
        </div>
      </div>
    </QuestionsProvider>
  );
};

export default QuestionsPageContent;
