import type { QuestionDetail, Answer } from '@/features/questions/model';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';

interface Props {
  question?: QuestionDetail;
  answer?: Answer;
  onUpvote?: () => void;
  onDownvote?: () => void;
}

const VoteButtons = ({ question, answer, onUpvote, onDownvote }: Props) => {
  const displayCount = question?.upCount ?? answer?.upCount ?? 0;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <button
        className="w-9 h-9 items-center justify-center flex bg-neutral-surface-strong text-neutral-text-default rounded-lg cursor-pointer hover:text-brand-text-on-default hover:bg-brand-surface-default/80 transition-colors duration-150"
        onClick={onUpvote}
      >
        <ArrowBigUp strokeWidth={2} size={24} />
      </button>

      <span className="text-neutral-text-default text-display-16">
        {displayCount}
      </span>

      <button
        className="w-9 h-9 items-center justify-center flex bg-neutral-surface-strong text-neutral-text-default rounded-lg cursor-pointer hover:text-brand-text-on-default hover:bg-brand-surface-default/80 transition-colors duration-150"
        onClick={onDownvote}
      >
        <ArrowBigDown strokeWidth={2} size={24} />
      </button>
    </div>
  );
};

export default VoteButtons;
