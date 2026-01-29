import type { Answer, QuestionDetail } from '@/features/questions/model/';
import { Calendar1 } from 'lucide-react';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';
import { useAuth } from '@/features/login/model/auth.store';
import { useRouter } from 'next/navigation';
import { deleteAnswer, deleteQuestion } from '../../api/questions.api';
import CustomTooltip from '@/shared/ui/Tooltip/CustomTooltip';

const CardHeader = ({
  question,
  answer,
  hasAcceptedAnswer = false,
}: {
  question?: QuestionDetail;
  answer?: Answer;
  hasAcceptedAnswer?: boolean;
}) => {
  const { member } = useAuth();
  const router = useRouter();

  const targetMemberId = question ? question.member.id : answer?.member.id;
  const isAuthor = member && targetMemberId === member.member.id;

  const handleCorrection = () => {
    if (!member) {
      alert('로그인이 필요해요.');
      return;
    }

    if (question) {
      // 질문 수정 페이지 이동
      router.push(`/questions/${question.id}/edit`);
    } else if (answer) {
      // 답변 수정 페이지 이동
      router.push(`/questions/${answer.questionId}/answers/${answer.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!member) {
      alert('로그인이 필요해요.');
      return;
    }

    if (!question && !answer) return;

    if (!confirm('정말 삭제하시겠어요?')) return;

    try {
      if (question) {
        await deleteQuestion(question.id);
        router.push('/questions');
      } else if (answer) {
        await deleteAnswer(answer.id);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) alert('삭제에 실패했습니다.');
    }
  };

  const TOOLTIP_MESSAGE = '답변이 채택되면 수정이나 삭제가 불가능해요';
  const shouldShowTooltip = !hasAcceptedAnswer && answer && !answer.isAccepted;

  return (
    <div className="w-full h-10 flex flex-row items-center px-4 bg-neutral-surface-strong rounded-t-2xl border-b border-neutral-border-default">
      <div className="flex flex-row items-center gap-4">
        {question && (
          <UserProfile
            imageSrc={question.member.avatarUrl}
            nickname={question.member.nickname}
            size="medium"
          />
        )}
        {answer && (
          <UserProfile
            imageSrc={answer.member.avatarUrl}
            nickname={answer.member.nickname}
            size="medium"
          />
        )}
        <div className="flex flex-row items-center justify-center gap-1">
          <Calendar1
            className="text-neutral-text-weak"
            strokeWidth={2}
            size={14}
          />
          <span className="text-neutral-text-weak text-body-12">
            {question
              ? extractDate(question?.createdAt)
              : extractDate(answer?.createdAt)}
          </span>
        </div>
      </div>
      {isAuthor && (
        <div className="ml-auto flex flex-row items-center justify-center gap-2">
          {question && (
            <>
              <button
                className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150"
                onClick={handleCorrection}
              >
                수정
              </button>
              <button
                className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150"
                onClick={handleDelete}
              >
                삭제
              </button>
            </>
          )}
          {answer && !answer.isAccepted && (
            <>
              {shouldShowTooltip ? (
                <CustomTooltip
                  content={TOOLTIP_MESSAGE}
                  contentClassName="bg-brand-surface-default text-brand-text-on-default"
                >
                  <button
                    className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150"
                    onClick={handleCorrection}
                  >
                    수정
                  </button>
                </CustomTooltip>
              ) : (
                <button
                  className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150"
                  onClick={handleCorrection}
                >
                  수정
                </button>
              )}
              {shouldShowTooltip ? (
                <CustomTooltip
                  content={TOOLTIP_MESSAGE}
                  contentClassName="bg-brand-surface-default text-brand-text-on-default"
                >
                  <button
                    className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150"
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                </CustomTooltip>
              ) : (
                <button
                  className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CardHeader;
