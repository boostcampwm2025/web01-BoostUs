import { Question } from '@/features/questions/model/questions.type';
import {
  Calendar1,
  Eye,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

import UserProfile from '@/shared/ui/UserProfile';
import extractDate from '@/shared/utils/extractDate';
import { MetaInfoItem } from '@/shared/ui/MetaInfoItem/MetaInfoItem';

const ListCardFooter = ({ question }: { question: Question }) => {
  return (
    <div className="flex flex-row items-center justify-end gap-4 w-full">
      <UserProfile
        imageSrc={question.member.avatarUrl}
        nickname={question.member.nickname}
        size="small"
      />
      <div className="flex flex-row items-center justify-center gap-3">
        <MetaInfoItem icon={ThumbsUp}>{question.upCount}</MetaInfoItem>

        <MetaInfoItem icon={ThumbsDown}>{question.downCount}</MetaInfoItem>

        <MetaInfoItem icon={MessageCircle}>{question.answerCount}</MetaInfoItem>

        <MetaInfoItem icon={Eye}>{question.viewCount}</MetaInfoItem>

        <MetaInfoItem icon={Calendar1}>
          {extractDate(question.createdAt)}
        </MetaInfoItem>
      </div>
    </div>
  );
};

export default ListCardFooter;
