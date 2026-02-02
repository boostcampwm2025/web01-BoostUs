import { Question } from '@/features/questions/model/questions.type';
import { Calendar1, Eye, MessageCircle } from 'lucide-react';
import { UpvoteIcon } from '@/components/ui/upvote';
import { DownvoteIcon } from '@/components/ui/downvote';
import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';

const ListCardFooter = ({ question }: { question: Question }) => {
  return (
    <div className="flex flex-row items-center justify-end gap-4 w-full">
      <UserProfile
        imageSrc={question.member.avatarUrl}
        nickname={question.member.nickname}
        size="small"
      />
      <div className="flex flex-row items-center justify-center gap-3">
        <div className="flex flex-row items-center justify-center gap-1">
          <UpvoteIcon className="text-neutral-text-weak" size={14} />
          <span className="text-neutral-text-weak text-body-12">
            {question.upCount}
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-1">
          <DownvoteIcon className="text-neutral-text-weak" size={14} />
          <span className="text-neutral-text-weak text-body-12">
            {question.downCount}
          </span>
        </div>
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
        <div className="flex flex-row items-center justify-center gap-1">
          <Calendar1
            className="text-neutral-text-weak"
            strokeWidth={2}
            size={14}
          />
          <span className="text-neutral-text-weak text-body-12">
            {extractDate(question.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListCardFooter;
