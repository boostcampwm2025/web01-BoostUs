'use client';

import { useRouter } from 'next/navigation';

const QuestionButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push('/questions/register')}
      className="flex items-center justify-center h-10 px-3 cursor-pointer whitespace-nowrap rounded-xl bg-brand-surface-default"
    >
      <span className="text-string-16 text-brand-text-on-default">
        질문하기
      </span>
    </button>
  );
};

export default QuestionButton;
