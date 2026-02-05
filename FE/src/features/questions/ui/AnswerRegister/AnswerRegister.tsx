'use client';

import { useRouter } from 'next/navigation';
import { createAnswer, QUESTIONS_KEY } from '../../api/questions.api';
import PostEditorForm from '@/features/questions/ui/Form/PostEditorForm';
import { useQueryClient } from '@tanstack/react-query';
import { revalidateByTag } from '@/shared/actions/revalidate';

export default function AnswerRegister({ questionId }: { questionId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <PostEditorForm
      type="answer"
      variant="create"
      onSubmit={async (values) => {
        await createAnswer(questionId, {
          contents: values.contents,
        });

        await queryClient.invalidateQueries({
          queryKey: QUESTIONS_KEY.detail(questionId),
        });
        await revalidateByTag('questions');

        router.push(`/questions/${questionId}`);
        router.refresh();
        return undefined;
      }}
    />
  );
}
