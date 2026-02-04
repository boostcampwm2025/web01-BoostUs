'use client';

import { useAuth } from '@/features/login/model/auth.store';
import AnswerCard from '@/features/questions/ui/QuestionDetail/AnswerCard';
import QuestionCard from '@/features/questions/ui/QuestionDetail/QuestionCard';
import QuestionStatus from '@/features/questions/ui/Status/Status';
import BackButton from '@/shared/ui/BackButton';
import { Eye, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/shared/ui/Button/Button';
import CustomTooltip from '@/shared/ui/Tooltip/CustomTooltip';
import { MetaInfoItem } from '@/shared/ui/MetaInfoItem/MetaInfoItem';
import Link from 'next/link';
import { toast } from '@/shared/utils/toast';
import { useQuery } from '@tanstack/react-query';
import {
  getQuestionById,
  incrementQuestionView,
  QUESTIONS_KEY,
} from '@/features/questions/api/questions.api';

interface QuestionDetailProps {
  questionId: string;
}

const QuestionDetail = ({ questionId }: QuestionDetailProps) => {
  const { member } = useAuth();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: QUESTIONS_KEY.detail(questionId),
    queryFn: () => getQuestionById(questionId),
  });

  const question = data?.question;
  const answers = data?.answers ?? [];

  const [viewCount, setViewCount] = useState(question?.viewCount ?? 0);

  // React Query 데이터가 로드/업데이트되면 viewCount 동기화
  // (Hydration 시점 차이로 초기값이 0일 수 있으므로 필요)
  useEffect(() => {
    if (question?.viewCount !== undefined) {
      setViewCount(question.viewCount);
    }
  }, [question?.viewCount]);

  // 조회수 증가 로직 (서버 요청 후 +1)
  useEffect(() => {
    const incrementView = async () => {
      try {
        await incrementQuestionView(questionId);
        // 이미 위 useEffect에서 서버 값으로 동기화되었을 수 있으므로
        // 안전하게 현재 상태 기반으로 +1
        setViewCount((prev) => prev + 1);
      } catch (error) {
        toast.error(error);
      }
    };
    void incrementView();
  }, [questionId]);

  if (!question) return null; // TODO: 스켈레톤

  const hasAcceptedAnswer = answers.some((answer) => answer.isAccepted);

  return (
    <article className="mx-auto flex w-full max-w-270 flex-col items-start justify-center">
      <BackButton url="/questions" />
      <h1 className="mt-4 text-display-32 text-neutral-text-strong">
        {question.title}
      </h1>
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-row gap-4 mt-3">
          <QuestionStatus status={question.isResolved} />
          <MetaInfoItem icon={MessageCircle} iconClassName="w-3.5 h-3.5">
            {question.answerCount}
          </MetaInfoItem>
          <MetaInfoItem icon={Eye} iconClassName="w-3.5 h-3.5">
            {viewCount}
          </MetaInfoItem>
        </div>
        {!member ? (
          <CustomTooltip
            content="로그인 후 답변을 등록할 수 있어요"
            contentClassName="bg-brand-surface-default text-brand-text-on-default"
          >
            <Button
              onClick={() => {
                const { pathname, search, hash } = window.location;
                const currentPath = `${pathname}${search}${hash}`;
                toast.warning('로그인이 필요한 기능입니다.');
                router.push(
                  `/login?redirect=${encodeURIComponent(currentPath)}`
                );
              }}
            >
              답변하기
            </Button>
          </CustomTooltip>
        ) : (
          <Link href={`/questions/${question.id}/answers/`}>
            <Button>답변하기</Button>
          </Link>
        )}
      </div>
      <QuestionCard question={question} hasAcceptedAnswer={hasAcceptedAnswer} />
      {answers.length > 0 ? (
        <>
          <h2 className="mt-12 text-display-24 text-neutral-text-strong">
            {question.answerCount}개의 답변
          </h2>
          {answers
            .map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                question={question}
                hasAcceptedAnswer={hasAcceptedAnswer}
              />
            ))
            .reverse()}
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
