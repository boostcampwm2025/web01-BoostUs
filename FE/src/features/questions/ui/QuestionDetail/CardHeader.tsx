import type { Answer, QuestionDetail } from '@/features/questions/model/';
import { Calendar1 } from 'lucide-react';
import Image from 'next/image';

const CardHeader = ({
  question,
  answer,
}: {
  question?: QuestionDetail;
  answer?: Answer;
}) => {
  return (
    <div className="w-full h-10 flex flex-row items-center px-4 bg-neutral-surface-strong rounded-t-2xl border-b border-neutral-border-default">
      <div className="flex flex-row items-center gap-6">
        <div className="flex flex-row items-center justify-center gap-2">
          {question && (
            <Image
              src={question.member.avatarUrl}
              alt={`${question.member.nickname}'의 프로필 사진`}
              className="object-cover rounded-full"
              width={24}
              height={24}
            />
          )}
          {answer && (
            <Image
              src={answer.member.avatarUrl}
              alt={`${answer.member.nickname}'의 프로필 사진`}
              className="object-cover rounded-full"
              width={24}
              height={24}
            />
          )}

          <span className="text-string-16 text-neutral-text-default">
            {question ? question.member.nickname : answer?.member.nickname}
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-1">
          <Calendar1
            className="text-neutral-text-weak"
            strokeWidth={2}
            size={14}
          />
          <span className="text-neutral-text-weak text-body-12">
            {question
              ? question.createdAt.slice(0, 10)
              : answer?.createdAt.slice(0, 10)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
