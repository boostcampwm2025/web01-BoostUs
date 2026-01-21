'use client';

import { Question } from '@/features/questions/model/questions.type';
import { QuestionsProvider } from '@/features/questions/model';
import QuestionButton from '@/features/questions/ui/Button/QuestionButton';
import QuestionsHeader from '@/features/questions/ui/Header/Header';
import QuestionsList from '@/features/questions/ui/List/List';
import QuestionsSearchBar from '@/features/questions/ui/SearchBar/SearchBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const QuestionsPageContent = ({
  initialQuestions,
}: {
  initialQuestions: Question[];
}) => {
  return (
    <QuestionsProvider>
      <div className="flex flex-col w-full font-sans max-w-270">
        <QuestionsHeader />
        <div className="flex flex-row gap-4 mt-8">
          <QuestionsSearchBar />
          <QuestionButton />
        </div>
        <QuestionsList initialQuestions={initialQuestions} />
        <div className="flex flex-row items-center justify-center gap-2 mt-4">
          <button className="cursor-pointer text-neutral-text-weak hover:text-neutral-text-strong">
            <ChevronLeft strokeWidth={1} />
          </button>
          <button className="cursor-pointer text-neutral-text-weak hover:text-neutral-text-strong">
            1
          </button>
          <button className="cursor-pointer text-neutral-text-weak hover:text-neutral-text-strong">
            2
          </button>
          <button className="cursor-pointer text-neutral-text-weak hover:text-neutral-text-strong">
            <ChevronRight strokeWidth={1} />
          </button>
        </div>
      </div>
    </QuestionsProvider>
  );
};

export default QuestionsPageContent;
