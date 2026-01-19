'use client';

import { MOCK_QUESTIONS } from '@/entities/qna/config/mockData';
import { QuestionCard } from '@/entities/qna/ui/QuestionCard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function QuestionList() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  const filteredQuestions = MOCK_QUESTIONS.filter((question) => {
    if (filter === 'unanswered') {
      return !question.isResolved;
    }
    if (filter === 'popular') {
      return question.likeCount > 30;
    }
    return true;
  });

  return (

    <div className="flex flex-col gap-8">
      {filteredQuestions.map((question) => (
        <QuestionCard key={question.id} data={question} />
      ))}
    </div>
  );
}
