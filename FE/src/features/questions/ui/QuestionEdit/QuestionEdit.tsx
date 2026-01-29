'use client';

import { useEffect, useState } from 'react';
import { getQuestionById, editQuestion } from '../../api/questions.api';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/login/model/auth.store';
import PostEditorForm, {
  PostFormValues,
} from '@/features/questions/ui/Form/PostEditorForm';

export default function QuestionEditPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const router = useRouter();
  const { member, isLoading } = useAuth();

  const [initialValues, setInitialValues] = useState<PostFormValues | null>(
    null
  );

  useEffect(() => {
    // member가 아직 로딩 전(null)일 수 있으면,
    // 스토어에 hydration 플래그가 없다는 전제에서는 그냥 early return이 안전함
    if (!questionId || isLoading) return;

    void (async () => {
      const data = await getQuestionById(questionId);
      const q = data.question; // ✅ 핵심

      // ✅ 작성자만 수정 가능
      if (!member || member?.member.id !== q.member.id) {
        alert('수정 권한이 없어요.');
        router.replace(`/questions/${questionId}`);
        return;
      }

      setInitialValues({
        title: q.title,
        contents: q.contents,
        hashtags: q.hashtags ?? [],
      });
    })();
  }, [questionId, member, isLoading, router]);

  if (!initialValues) {
    return <div className="max-w-270 mx-auto p-6">로딩 중...</div>;
  }

  return (
    <PostEditorForm
      type="question"
      variant="edit"
      initialValues={initialValues}
      onSubmit={async (values) => {
        if (!values.title) return undefined;
        await editQuestion(questionId, {
          title: values.title,
          contents: values.contents,
          hashtags: values.hashtags,
        });
        router.push(`/questions/${questionId}`);
        return undefined;
      }}
    />
  );
}
