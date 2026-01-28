'use client';

import { useEffect, useState } from 'react';
import QuestionForm from '../Form/QuestionFrom';
import { getQuestionById, editQuestion } from '../../api/questions.api';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/login/model/auth.store';

export default function QuestionEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { member } = useAuth();

  const [initialValues, setInitialValues] = useState<{
    title: string;
    contents: string;
    hashtags: string[];
    authorId: string;
  } | null>(null);

  useEffect(() => {
    // member가 아직 로딩 전(null)일 수 있으면,
    // 스토어에 hydration 플래그가 없다는 전제에서는 그냥 early return이 안전함
    if (!id) return;

    void (async () => {
      const data = await getQuestionById(id);
      const q = data.question; // ✅ 핵심

      // ✅ 작성자만 수정 가능
      if (!member || member.id !== q.member.id) {
        alert('수정 권한이 없어요.');
        router.replace(`/questions/${id}`);
        return;
      }

      setInitialValues({
        title: q.title,
        contents: q.contents,
        hashtags: q.hashtags ?? [],
        authorId: q.member.id,
      });
    })();
  }, [id, member, router]);

  if (!initialValues) {
    return <div className="max-w-270 mx-auto p-6">로딩 중...</div>;
  }

  return (
    <QuestionForm
      variant="edit"
      initialValues={initialValues}
      onSubmit={async (payload) => {
        await editQuestion(id, payload); // ✅ editQuestion
        router.push(`/questions/${id}`);
      }}
    />
  );
}
