import { UpvoteIcon } from '@/components/ui/upvote';
import { DownvoteIcon } from '@/components/ui/downvote';
import { Reaction } from '@/features/questions/model/questions.type';

interface Props {
  upCount: number;
  reaction: Reaction;
  onUpvote?: () => void;
  onDownvote?: () => void;
}

const VoteButtons = ({ upCount, reaction, onUpvote, onDownvote }: Props) => {
  const baseBtnClass =
    'w-9 h-9 items-center justify-center flex rounded-lg cursor-pointer transition-colors duration-150';
  const inactiveClass =
    'bg-neutral-surface-strong text-neutral-text-default hover:text-brand-text-on-default hover:bg-brand-surface-default/80';
  const activeClass = 'bg-brand-surface-default text-brand-text-on-default'; // 활성화 시 스타일

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <button
        className={`${baseBtnClass} ${reaction === 'LIKE' ? activeClass : inactiveClass}`}
        onClick={onUpvote}
        aria-label="Upvote"
      >
        <UpvoteIcon size={24} />
      </button>

      <span className="text-neutral-text-default text-display-16">
        {upCount}
      </span>

      <button
        className={`${baseBtnClass} ${reaction === 'DISLIKE' ? activeClass : inactiveClass}`}
        onClick={onDownvote}
        aria-label="Downvote"
      >
        <DownvoteIcon size={24} />
      </button>
    </div>
  );
};

export default VoteButtons;
