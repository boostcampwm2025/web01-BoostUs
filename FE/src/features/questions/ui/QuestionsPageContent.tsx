'use client';

import {
  Question,
  QuestionCounts,
} from '@/features/questions/model/questions.type';
import { QuestionsProvider } from '@/features/questions/model';
import QuestionsList from '@/features/questions/ui/List/List';
import QuestionsSearchBar from '@/features/questions/ui/SearchBar/SearchBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Meta } from '@/shared/types/PaginationType';
import { useQuestionPagination } from '@/features/questions/model/useQuestionsPagination';
import PageHeader from '@/shared/ui/PageHeader';
import Button from '@/shared/ui/Button/Button';

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
        <PageHeader
          title="질문 & 답변"
          subtitle="부스트캠프, 기술, 커리어 등 모든 질문과 답변을 한 곳에서"
        />
        <div className="flex flex-row gap-4 mt-8">
          <QuestionsSearchBar />
          <Button content="질문하기" />
        </div>
        <div
          className={`transition-opacity duration-200 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
        >
          <QuestionsList initialQuestions={questions} counts={counts} />
        </div>
        <div className="flex flex-row items-center justify-center gap-2 mt-4">
          <Button
            onClick={handlePrev}
            buttonStyle="text"
            disabled={!hasPrev || isLoading}
          >
            <ChevronLeft strokeWidth={1} />
            <span>이전</span>
          </Button>
          <span className="text-neutral-text-default text-string-16">
            {currentPage} 페이지
          </span>
          <Button
            onClick={handleNext}
            buttonStyle="text"
            disabled={!hasNext || isLoading}
          >
            <span>다음</span>
            <ChevronRight strokeWidth={1} />
          </Button>
        </div>
      </div>
    </QuestionsProvider>
  );
};

export default QuestionsPageContent;
