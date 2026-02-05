'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { editAnswer, QUESTIONS_KEY } from '../../api/questions.api';
import { useAuth } from '@/features/login/model/auth.store';
import { getAnswerById } from '@/features/questions/api/questions.api';
import PostEditorForm, {
  PostFormValues,
} from '@/features/questions/ui/Form/PostEditorForm';
import { toast } from '@/shared/utils/toast';
import { revalidateByTag } from '@/shared/actions/revalidate';
import { useQueryClient } from '@tanstack/react-query';

export default function AnswerEditPage() {
  const router = useRouter();
  const { member } = useAuth();
  const queryClient = useQueryClient();

  // 예시 라우트: /questions/[questionId]/answers/[answerId]/edit
  const { questionId, answerId } = useParams<{
    questionId: string;
    answerId: string;
  }>();

  const [initialValues, setInitialValues] = useState<PostFormValues | null>(
    null
  );

  useEffect(() => {
    if (!questionId || !answerId) return;
    if (!member) return; // member hydration 문제 최소 방어

    void (async () => {
      try {
        const a = await getAnswerById(answerId);
        if (member.member.id !== a.member.id) {
          toast.error('답변을 수정 할 권한이 없어요.');
          router.replace(`/questions/${questionId}`);
          return;
        }

        setInitialValues({
          contents: a.contents,
        });
      } catch (error) {
        toast.error(error);
        router.replace(`/questions/${questionId}`);
      }
    })();
  }, [questionId, answerId, member, router]);

  if (!initialValues) return <div className="p-6">로딩 중...</div>;

  return (
    <PostEditorForm
      type="answer"
      variant="edit"
      initialValues={initialValues}
      onSubmit={async (values) => {
        try {
          await editAnswer(answerId, { contents: values.contents });

          await queryClient.invalidateQueries({
            queryKey: QUESTIONS_KEY.detail(questionId),
          });

          // 2. ✅ [수정] 태그 기반 ISR 캐시 무효화
          await revalidateByTag('questions');

          toast.success('답변이 수정되었습니다.');
          router.push(`/questions/${questionId}`);
        } catch (error) {
          toast.error(error);
        }
        return undefined;
      }}
    />
  );
}
