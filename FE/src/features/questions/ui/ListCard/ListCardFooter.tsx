import { Question } from '@/features/questions/model/questions.type';
import {
  ArrowBigDown,
  ArrowBigUp,
  Calendar1,
  Eye,
  MessageCircle,
} from 'lucide-react';
import Image from 'next/image';

const ListCardFooter = ({ question }: { question: Question }) => {
  return (
    <div className="flex flex-row items-center justify-end gap-4 w-full">
      <div className="flex flex-row items-center justify-center gap-1">
        <div className="relative w-4 h-4">
          <Image
            src={question.member.avatarUrl}
            alt={`${question.member.nickname}'의 프로필 사진`}
            className="object-cover rounded-full"
            fill
          />
        </div>
        <span className="text-body-12 text-neutral-text-weak">
          {question.member.nickname}
        </span>
      </div>
      <div className="flex flex-row items-center justify-center gap-3">
        <div className="flex flex-row items-center justify-center gap-1">
          <ArrowBigUp
            className="text-neutral-text-weak"
            strokeWidth={2}
            size={14}
          />
          <span className="text-neutral-text-weak text-body-12">
            {question.upCount}
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-1">
          <ArrowBigDown
            className="text-neutral-text-weak"
            strokeWidth={2}
            size={14}
          />
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
            {question.createdAt.slice(0, 10)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListCardFooter;
