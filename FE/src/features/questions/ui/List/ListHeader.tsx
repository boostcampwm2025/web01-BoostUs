'use client';

import { useQuestionsContext } from '@/features/questions/model';
import {
  QuestionCounts,
  QuestionsStatusFilter,
} from '@/features/questions/model/questions.type';
import Dropdown from '@/features/questions/ui/Dropdown/Dropdown';

interface StatusButtonProps {
  label: string;
  value: QuestionsStatusFilter;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

const StatusButton = ({
  label,
  isActive,
  onClick,
  count,
}: StatusButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-row items-center justify-center cursor-pointer gap-1 transition-colors duration-150 ${
        isActive
          ? 'text-neutral-text-strong'
          : 'text-neutral-text-weak hover:text-neutral-text-strong'
      }`}
    >
      <span className="text-body-16">{label}</span>
      <div className="flex items-center justify-center bg-neutral-surface-bold rounded-full px-2">
        <span className="text-neutral-text-weak text-body-12">{count}</span>
      </div>
    </button>
  );
};

const ListHeader = ({ counts }: { counts: QuestionCounts }) => {
  const { status, setStatus } = useQuestionsContext();

  return (
    <div className="flex flex-row items-center justify-between w-full h-16 px-6 border-b border-neutral-border-default bg-neutral-surface-strong rounded-t-2xl">
      <div className="flex flex-row items-center gap-4">
        <StatusButton
          label="전체"
          value="all"
          isActive={status === 'all'}
          onClick={() => setStatus('all')}
          count={counts.total}
        />
        <StatusButton
          label="답변 없음"
          value="unanswered"
          isActive={status === 'unanswered'}
          onClick={() => setStatus('unanswered')}
          count={counts.noAnswer}
        />
        <StatusButton
          label="미해결"
          value="unsolved"
          isActive={status === 'unsolved'}
          onClick={() => setStatus('unsolved')}
          count={counts.unsolved}
        />
        <StatusButton
          label="해결됨"
          value="solved"
          isActive={status === 'solved'}
          onClick={() => setStatus('solved')}
          count={counts.solved}
        />
      </div>
      <Dropdown />
    </div>
  );
};

export default ListHeader;
