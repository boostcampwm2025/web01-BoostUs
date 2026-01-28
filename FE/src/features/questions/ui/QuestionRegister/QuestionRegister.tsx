'use client';

import QuestionForm from '../Form/QuestionFrom';
import { createQuestion } from '@/features/questions/api/questions.api';
import { useRouter } from 'next/navigation';

export default function QuestionRegisterPage() {
  const router = useRouter();
  return (
    <QuestionForm
      variant="create"
      onSubmit={async (payload) => {
        const created = await createQuestion(payload);
        router.push(`/questions/${created.id}`);
        return { id: created.id };
      }}
    />
  );
}
