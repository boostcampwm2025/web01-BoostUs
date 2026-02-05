'use client';

import {
  QuestionCounts,
  QuestionsStatusFilter,
} from '@/features/questions/model/questions.type';
import Dropdown from '@/features/questions/ui/Dropdown/Dropdown';
import { useRouter, useSearchParams } from 'next/navigation';

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
      <span className={isActive ? 'text-string-16' : 'text-body-16'}>
        {label}
      </span>
      <div className="flex items-center justify-center bg-neutral-surface-bold rounded-full px-2">
        <span className="text-neutral-text-weak text-body-12">{count}</span>
      </div>
    </button>
  );
};

const ListHeader = ({ counts }: { counts: QuestionCounts }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 현재 상태 읽기
  const currentStatus =
    (searchParams.get('status') as QuestionsStatusFilter) || 'all';

  const handleStatusChange = (newStatus: QuestionsStatusFilter) => {
    // 기존 쿼리 파라미터 유지하면서 status만 변경
    const params = new URLSearchParams(searchParams.toString());

    if (newStatus === 'all') {
      params.delete('status');
    } else {
      params.set('status', newStatus);
    }

    // 필터 변경 시 커서(페이지) 초기화가 필요할 수 있으므로 cursor 삭제 권장
    params.delete('cursor');

    router.push(`/questions?${params.toString()}`);
  };

  return (
    <div className="flex flex-row items-center justify-between w-full h-16 px-6 border-b border-neutral-border-default bg-neutral-surface-strong rounded-t-2xl">
      <div className="flex flex-row items-center gap-4">
        <StatusButton
          label="전체"
          value="all"
          isActive={currentStatus === 'all'}
          onClick={() => handleStatusChange('all')}
          count={counts.total}
        />
        <StatusButton
          label="답변 없음"
          value="unanswered"
          isActive={currentStatus === 'unanswered'}
          onClick={() => handleStatusChange('unanswered')}
          count={counts.noAnswer}
        />
        <StatusButton
          label="미해결"
          value="unsolved"
          isActive={currentStatus === 'unsolved'}
          onClick={() => handleStatusChange('unsolved')}
          count={counts.unsolved}
        />
        <StatusButton
          label="해결됨"
          value="solved"
          isActive={currentStatus === 'solved'}
          onClick={() => handleStatusChange('solved')}
          count={counts.solved}
        />
      </div>
      <Dropdown />
    </div>
  );
};

export default ListHeader;
