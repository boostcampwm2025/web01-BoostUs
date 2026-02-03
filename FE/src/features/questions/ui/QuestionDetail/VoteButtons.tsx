import { UpvoteIcon } from '@/components/ui/upvote';
import { DownvoteIcon } from '@/components/ui/downvote';
import { Reaction } from '@/features/questions/model/questions.type';
import CustomTooltip from '@/shared/ui/Tooltip/CustomTooltip';
import { JSX } from 'react';

interface Props {
  upCount: number;
  reaction: Reaction;
  onUpvote?: () => void;
  onDownvote?: () => void;
  isLoggedIn?: boolean;
}

const VoteButtons = ({
  upCount,
  reaction,
  onUpvote,
  onDownvote,
  isLoggedIn = true,
}: Props) => {
  const baseBtnClass =
    'w-9 h-9 items-center justify-center flex rounded-lg cursor-pointer transition-colors duration-150';
  const inactiveClass =
    'bg-neutral-surface-strong text-neutral-text-default hover:text-brand-text-on-default hover:bg-brand-surface-default/80';
  const activeClass = 'bg-brand-surface-default text-brand-text-on-default'; // 활성화 시 스타일

  const renderVoteButton = (
    isUpvote: boolean,
    onClick?: () => void
  ): JSX.Element => {
    const isActive = isUpvote ? reaction === 'LIKE' : reaction === 'DISLIKE';
    const Icon = isUpvote ? UpvoteIcon : DownvoteIcon;
    const label = isUpvote ? 'Upvote' : 'Downvote';

    const button = (
      <button
        className={`${baseBtnClass} ${isActive ? activeClass : inactiveClass}`}
        onClick={onClick}
        aria-label={label}
      >
        <Icon size={24} />
      </button>
    );

    if (!isLoggedIn) {
      return (
        <CustomTooltip
          content="로그인 후 투표 할 수 있어요"
          contentClassName="bg-brand-surface-default text-brand-text-on-default"
          side="right"
        >
          {button}
        </CustomTooltip>
      );
    }

    return button;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {renderVoteButton(true, onUpvote)}

      <span className="text-neutral-text-default text-display-16">
        {upCount}
      </span>

      {renderVoteButton(false, onDownvote)}
    </div>
  );
};

export default VoteButtons;
