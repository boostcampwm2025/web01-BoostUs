'use client';

import {
  createQuestion,
  QUESTIONS_KEY,
} from '@/features/questions/api/questions.api';
import { useRouter } from 'next/navigation';
import PostEditorForm from '@/features/questions/ui/Form/PostEditorForm';
import { toast } from '@/shared/utils/toast';
import { useQueryClient } from '@tanstack/react-query';
import { revalidatePageCache } from '@/shared/actions/revalidate';

export default function QuestionRegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <PostEditorForm
      type="question"
      variant="create"
      onSubmit={async (values) => {
        try {
          const res = await createQuestion({
            title: values.title ?? '',
            contents: values.contents,
            hashtags: values.hashtags,
          });
          if (res?.id) {
            await queryClient.invalidateQueries({
              queryKey: QUESTIONS_KEY.lists(),
            });
            await revalidatePageCache('/questions');

            toast.success('질문이 등록되었습니다.');
            router.push(`/questions/${res.id}`);
            return res;
          }
          toast.error('질문 등록에 실패했습니다. 다시 시도해주세요.');
          return undefined;
        } catch (error) {
          toast.error(error);
          return undefined;
        }
      }}
    />
  );
}
