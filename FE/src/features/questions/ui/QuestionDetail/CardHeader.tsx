import type { Answer, QuestionDetail } from '@/features/questions/model/';
import { Calendar1 } from 'lucide-react';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';
import { useAuth } from '@/features/login/model/auth.store';
import { useRouter } from 'next/navigation';
import { deleteAnswer } from '../../api/questions.api';

const CardHeader = ({
  question,
  answer,
}: {
  question?: QuestionDetail;
  answer?: Answer;
}) => {
  const { member } = useAuth();
  const router = useRouter();

  const handleCorrection = () => {
    if (!member) {
      alert('로그인이 필요해요.');
      return;
    }
    router.push(`/questions/${answer?.questionId}/answers/${answer?.id}/edit`);
  };

  const handleDelete = async () => {
    if (!member) {
      alert('로그인이 필요해요.');
      return;
    }
    await deleteAnswer(answer!.id);
    router.push(`/questions/${answer?.questionId}`);
  };

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
      {member && answer?.member.id === member.id && (
        <div className="ml-auto flex flex-row items-center justify-center gap-2">
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
        </div>
      )}
    </div>
  );
};

export default CardHeader;
