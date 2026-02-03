import type { Answer, QuestionDetail } from '@/features/questions/model/';
import { Calendar1 } from 'lucide-react';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';
import { useAuth } from '@/features/login/model/auth.store';
import { useRouter } from 'next/navigation';
import { deleteAnswer, deleteQuestion } from '../../api/questions.api';
import CustomTooltip from '@/shared/ui/Tooltip/CustomTooltip';
import { MetaInfoItem } from '@/shared/ui/MetaInfoItem/MetaInfoItem';
import { FormEvent } from 'react';
import CustomDialog from '@/shared/ui/Dialog/CustomDialog';

const ActionButtons = ({
  onCorrection,
  onDelete,
}: {
  onCorrection: () => void;
  onDelete: (e: FormEvent) => void;
}) => {
  return (
    <>
      <button
        className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150"
        onClick={onCorrection}
      >
        수정
      </button>
      <CustomDialog
        dialogTrigger={
          <button className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150">
            삭제
          </button>
        }
        dialogTitle="삭제 확인"
        dialogDescription="정말 삭제하시겠어요? 삭제된 내용은 복구할 수 없습니다."
        onSubmit={onDelete}
        cancelLabel="취소"
        submitLabel="삭제"
        footerClassName="mt-4"
      />
    </>
  );
};

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

  const target = question ?? answer;
  if (!target) return null;

  const isAuthor = member && target.member.id === member.member.id;
  const TOOLTIP_MESSAGE = '답변이 채택되면 수정이나 삭제가 불가능해요';

  // 답변이 채택되지 않았을 때 툴팁 표시
  const shouldShowTooltip =
    !question && answer && !hasAcceptedAnswer && !answer.isAccepted;

  const handleCorrection = () => {
    if (!member) {
      return;
    }

    if (question) {
      router.push(`/questions/${question.id}/edit`);
    } else if (answer) {
      router.push(`/questions/${answer.questionId}/answers/${answer.id}/edit`);
    }
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();

    if (!member) {
      return;
    }

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

  return (
    <div className="w-full h-10 flex flex-row items-center px-4 bg-neutral-surface-strong rounded-t-2xl border-b border-neutral-border-default">
      <div className="flex flex-row items-center gap-4">
        <UserProfile
          imageSrc={target.member.avatarUrl}
          nickname={target.member.nickname}
          size="medium"
        />

        <MetaInfoItem icon={Calendar1} iconClassName="w-3.5 h-3.5">
          {extractDate(target.createdAt)}
        </MetaInfoItem>
      </div>

      {isAuthor && (
        <div className="ml-auto flex flex-row items-center justify-center gap-2">
          {question && !hasAcceptedAnswer && (
            <CustomTooltip
              content={TOOLTIP_MESSAGE}
              contentClassName="bg-brand-surface-default text-brand-text-on-default"
            >
              <div className="flex gap-2">
                <ActionButtons
                  onCorrection={handleCorrection}
                  onDelete={handleDelete}
                />
              </div>
            </CustomTooltip>
          )}

          {answer &&
            !answer.isAccepted &&
            (shouldShowTooltip ? (
              <CustomTooltip
                content={TOOLTIP_MESSAGE}
                contentClassName="bg-brand-surface-default text-brand-text-on-default"
              >
                <div className="flex gap-2">
                  <ActionButtons
                    onCorrection={handleCorrection}
                    onDelete={handleDelete}
                  />
                </div>
              </CustomTooltip>
            ) : (
              <ActionButtons
                onCorrection={handleCorrection}
                onDelete={handleDelete}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CardHeader;
