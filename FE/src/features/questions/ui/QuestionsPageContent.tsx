'use client';

import {
  Question,
  QuestionCounts,
} from '@/features/questions/model/questions.type';
import { QuestionsProvider } from '@/features/questions/model';
import QuestionButton from '@/features/questions/ui/Button/QuestionButton';
import QuestionsHeader from '@/features/questions/ui/Header/Header';
import QuestionsList from '@/features/questions/ui/List/List';
import QuestionsSearchBar from '@/features/questions/ui/SearchBar/SearchBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Meta } from '@/shared/types/PaginationType';
import { useQuestionPagination } from '@/features/questions/model/useQuestionsPagination';

interface QuestionsPageContentProps {
  initialQuestions: Question[];
  meta: Meta;
  counts: QuestionCounts;
}

const QuestionsPageContent = ({
  initialQuestions,
  meta: initialMeta,
  counts,
}: QuestionsPageContentProps) => {
  const {
    questions,
    isLoading,
    currentPage,
    hasPrev,
    hasNext,
    handleNext,
    handlePrev,
  } = useQuestionPagination({ initialQuestions, initialMeta });

  return (
    <QuestionsProvider>
      <div className="flex flex-col w-full font-sans max-w-270">
        <QuestionsHeader />
        <div className="flex flex-row gap-4 mt-8">
          <QuestionsSearchBar />
          <QuestionButton />
        </div>
        <div
          className={`transition-opacity duration-200 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
        >
          <QuestionsList initialQuestions={questions} counts={counts} />
        </div>
        <div className="flex flex-row items-center justify-center gap-2 mt-4">
          <button
            onClick={handlePrev}
            disabled={!hasPrev || isLoading}
            className={`flex flex-row cursor-pointer text-neutral-text-weak hover:text-neutral-text-strong ${
              hasPrev
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
            disabled={!hasNext || isLoading}
            className={`flex flex-row cursor-pointer text-neutral-text-weak hover:text-neutral-text-strong ${
              hasNext
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
