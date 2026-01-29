'use client';

import { useRouter } from 'next/navigation';
import { createAnswer } from '../../api/questions.api';
import PostEditorForm from '@/features/questions/ui/Form/PostEditorForm';

export default function AnswerRegister({ questionId }: { questionId: string }) {
  const router = useRouter();

  return (
    <PostEditorForm
      type="answer"
      variant="create"
      onSubmit={async (values) => {
        await createAnswer(questionId, {
          contents: values.contents,
        });

        router.push(`/questions/${questionId}`);
        router.refresh();
        return undefined;
      }}
    />
  );
}
