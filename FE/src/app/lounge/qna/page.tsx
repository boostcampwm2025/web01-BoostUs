import QuestionList from '@/entities/qna/ui/QuestionList';
import { Suspense } from 'react';

export default function Qna() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestionList />
    </Suspense>
  );
}
