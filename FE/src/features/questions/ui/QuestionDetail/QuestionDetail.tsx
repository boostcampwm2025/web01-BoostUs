'use client';

import { useAuth } from '@/features/login/model/auth.store';
import type { Answer, QuestionDetail } from '@/features/questions/model';
import AnswerCard from '@/features/questions/ui/QuestionDetail/AnswerCard';
import QuestionCard from '@/features/questions/ui/QuestionDetail/QuestionCard';
import QuestionStatus from '@/features/questions/ui/Status/Status';
import BackButton from '@/shared/ui/BackButton';
import { Eye, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteQuestion } from '../../api/questions.api';
const QuestionDetail = ({
  data,
}: {
  data: { question: QuestionDetail; answers: Answer[] };
}) => {
  const { question, answers } = data;
  const { member } = useAuth();
  const router = useRouter();

  const handleSubmit = () => {
    if (!member) {
      alert('로그인이 필요해요.');
      return;
    }

    router.push(`/questions/${question.id}/answers`);
  };

  const handleCorrection = () => {
    if (!member) {
      alert('로그인이 필요해요.');
      return;
    }
    router.push(`/questions/${question.id}/edit`);
  };

  const handleDelete = async () => {
    if (!member) {
      alert('로그인이 필요해요.');
      return;
    }
    await deleteQuestion(question.id);
    router.push(`/questions`);
  };

  return (
    <article className="mx-auto flex w-full max-w-270 flex-col items-start justify-center">
      <BackButton />
      <div className="flex items-center justify-between w-full mt-4 mb-6">
        <h1 className="mt-4 text-display-32 text-neutral-text-strong">
          {question.title}
        </h1>
        {member?.id === question.member.id && (
          <div className="flex flex-row gap-4">
            <button
              type="button"
              onClick={handleCorrection}
              className="h-10 px-4 rounded-x cursor-pointer bg-brand-surface-default text-brand-text-on-default disabled:opacity-50 disabled:cursor-not-allowed"
            >
              수정하기
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="h-10 px-4 rounded-x cursor-pointer bg-brand-surface-default text-brand-text-on-default disabled:opacity-50 disabled:cursor-not-allowed"
            >
              삭제하기
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between w-full mt-4 mb-6">
        <div className="flex flex-row gap-4 mt-3">
          <QuestionStatus status={question.isResolved} />
          <div className="flex flex-row items-center justify-center gap-1">
            <MessageCircle
              className="text-neutral-text-weak"
              strokeWidth={2}
              size={14}
            />
            <span className="text-neutral-text-weak text-body-12">
              {question.answerCount}
            </span>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            <Eye className="text-neutral-text-weak" strokeWidth={2} size={14} />
            <span className="text-neutral-text-weak text-body-12">
              {question.viewCount}
            </span>
          </div>
        </div>
        <button
          type="button"
          disabled={!member}
          onClick={handleSubmit}
          className="h-10 px-4 rounded-x cursor-pointer bg-brand-surface-default text-brand-text-on-default disabled:opacity-50 disabled:cursor-not-allowed"
        >
          답변하기
        </button>
      </div>
      <QuestionCard question={question} />
      {answers.length > 0 ? (
        <>
          <h2 className="mt-12 text-display-24 text-neutral-text-strong">
            {question.answerCount}개의 답변
          </h2>
          {answers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} question={question} />
          ))}
        </>
      ) : (
        <p className="w-full flex items-center justify-center mt-12 text-string-16 text-neutral-text-weak">
          답변이 없습니다.
        </p>
      )}
    </article>
  );
};

export default QuestionDetail;
