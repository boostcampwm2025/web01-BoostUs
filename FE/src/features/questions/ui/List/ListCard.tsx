import QuestionStatus from '@/features/questions/ui/Status/Status';
import {
  ArrowBigDown,
  ArrowBigUp,
  Calendar1,
  Eye,
  MessageCircle,
} from 'lucide-react';

const ListCard = () => {
  return (
    <div className="flex flex-col px-6 py-3 bg-neutral-surface-bold">
      <QuestionStatus />
      <h2 className="mt-1 text-display-20 text-neutral-text-strong">
        BoostUs 질문 & 답변 페이지 제목
      </h2>
      <div className="flex flex-row gap-1 mt-2">
        <div className="flex items-center justify-center px-2 py-1 border rounded-full border-neutral-border-default bg-neutral-surface-strong">
          <span className="text-body-12 text-neutral-text-weak">BoostUs</span>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4 mt-2 w-fit">
        <div className="flex flex-row items-center justify-center gap-1">
          <div className="w-4 h-4 rounded-full bg-accent-green" />
          <span className="text-body-12 text-neutral-text-weak">June</span>
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          <div className="flex flex-row items-center justify-center gap-1">
            <ArrowBigUp
              className="text-neutral-text-weak"
              strokeWidth={2}
              size={14}
            />
            <span className="text-neutral-text-weak text-body-12">123</span>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            <ArrowBigDown
              className="text-neutral-text-weak"
              strokeWidth={2}
              size={14}
            />
            <span className="text-neutral-text-weak text-body-12">123</span>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            <MessageCircle
              className="text-neutral-text-weak"
              strokeWidth={2}
              size={14}
            />
            <span className="text-neutral-text-weak text-body-12">123</span>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            <Eye className="text-neutral-text-weak" strokeWidth={2} size={14} />
            <span className="text-neutral-text-weak text-body-12">123</span>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            <Calendar1
              className="text-neutral-text-weak"
              strokeWidth={2}
              size={14}
            />
            <span className="text-neutral-text-weak text-body-12">
              2026-01-19
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
