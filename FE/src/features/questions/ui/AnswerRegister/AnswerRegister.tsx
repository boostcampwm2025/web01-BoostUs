'use client';

import { useRouter } from 'next/navigation';
import AnswerForm from '../Form/AnswerFrom';
import { createAnswer } from '../../api/questions.api';

export default function AnswerRegister({ questionId }: { questionId: string }) {
  const router = useRouter();

  return (
    <AnswerForm
      variant="create"
      onSubmit={async (body) => {
        await createAnswer(questionId, body);
        router.push(`/questions/${questionId}`);
        router.refresh(); // ✅ 상세가 캐시일 수 있어서
      }}
    />
  );
}
