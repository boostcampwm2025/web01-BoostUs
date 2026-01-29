'use client';

import { createQuestion } from '@/features/questions/api/questions.api';
import { useRouter } from 'next/navigation';
import PostEditorForm from '@/features/questions/ui/Form/PostEditorForm';

export default function QuestionRegisterPage() {
  const router = useRouter();
  return (
    <PostEditorForm
      type="question"
      variant="create"
      onSubmit={async (values) => {
        const res = await createQuestion({
          title: values.title!,
          contents: values.contents,
          hashtags: values.hashtags,
        });
        if (res?.id) router.push(`/questions/${res.id}`);
        return res;
      }}
    />
  );
}
