'use client';

import { createQuestion } from '@/features/questions/api/questions.api';
import { useRouter } from 'next/navigation';
import PostEditorForm from '@/features/questions/ui/Form/PostEditorForm';
import { toast } from '@/shared/utils/toast';

export default function QuestionRegisterPage() {
  const router = useRouter();
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
