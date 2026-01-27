import type { Answer, QuestionDetail } from '@/features/questions/model/';
import { Calendar1 } from 'lucide-react';
import Image from 'next/image';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';

const CardHeader = ({
  question,
  answer,
}: {
  question?: QuestionDetail;
  answer?: Answer;
}) => {
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
    </div>
  );
};

export default CardHeader;
