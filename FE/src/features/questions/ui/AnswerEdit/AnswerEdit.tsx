'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AnswerForm from '../Form/AnswerForm';
import { editAnswer } from '../../api/questions.api';
import { useAuth } from '@/features/login/model/auth.store';
import { getAnswerById } from '@/features/questions/api/questions.api';

export default function AnswerEditPage() {
  const router = useRouter();
  const { member } = useAuth();

  // 예시 라우트: /questions/[questionId]/answers/[answerId]/edit
  const { questionId, answerId } = useParams<{
    questionId: string;
    answerId: string;
  }>();

  const [initialValues, setInitialValues] = useState<{
    contents: string;
    authorId: string;
  } | null>(null);

  useEffect(() => {
    if (!questionId || !answerId) return;
    if (!member) return; // member hydration 문제 최소 방어

    void (async () => {
      try {
        const a = await getAnswerById(answerId);
        if (member.member.id !== a.member.id) {
          alert('수정 권한이 없어요.');
          router.replace(`/questions/${questionId}`);
          return;
        }

        setInitialValues({
          contents: a.contents,
          authorId: a.member.id,
        });
      } catch (error) {
        alert('답변을 불러오는데 실패했습니다.');
        router.replace('questions/${questionId}');
      }
    })();
  }, [questionId, answerId, member, router]);

  if (!initialValues) return <div className="p-6">로딩 중...</div>;

  return (
    <AnswerForm
      variant="edit"
      initialValues={{ contents: initialValues.contents }}
      onSubmit={async (body) => {
        await editAnswer(answerId, body);
        router.push(`/questions/${questionId}`);
        router.refresh();
      }}
    />
  );
}
