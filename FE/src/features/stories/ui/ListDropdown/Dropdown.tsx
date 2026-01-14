'use client';

import { useStoriesContext } from '@/features/stories/model/stories.context';
import DropdownChip from '@/features/stories/ui/ListDropdown/DropdownChip';
import DropdownTitle from '@/features/stories/ui/ListDropdown/DropdownTitle';
import { ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';

const PERIOD_OPTIONS = [
  { key: 'daily', label: '오늘' },
  { key: 'weekly', label: '주간' },
  { key: 'monthly', label: '월간' },
  { key: 'all', label: '전체' },
] as const;

const SORT_BY_OPTIONS = [
  { key: 'latest', label: '최신순' },
  { key: 'views', label: '조회수 순' },
  { key: 'likes', label: '좋아요 순' },
] as const;

const StoriesListDropdown = () => {
  const { sortOption, setSortOption } = useStoriesContext();

  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'likes'>('latest');
  const [period, setPeriod] = useState<'all' | 'daily' | 'weekly' | 'monthly'>(
    'all'
  );

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="text-neutral-text-default flex cursor-pointer flex-row"
      >
        <span className="text-string-16">
          {SORT_BY_OPTIONS.find((option) => option.key === sortBy)?.label}
        </span>
        <ChevronDown strokeWidth={1} />
      </button>
      {isOpen && (
        <div className="bg-neutral-surface-strong shadow-default absolute right-0 z-20 mt-1 flex w-58 flex-col rounded-2xl">
          <DropdownTitle />
          <div className="flex w-full flex-row gap-2 px-3 py-2">
            <DropdownChip
              onClick={() => setSortBy('latest')}
              isActive={sortBy === 'latest'}
              label="최신순"
            />
            <DropdownChip
              onClick={() => setSortBy('views')}
              isActive={sortBy === 'views'}
              label="조회수 순"
            />
            <DropdownChip
              onClick={() => setSortBy('likes')}
              isActive={sortBy === 'likes'}
              label="좋아요 순"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesListDropdown;
