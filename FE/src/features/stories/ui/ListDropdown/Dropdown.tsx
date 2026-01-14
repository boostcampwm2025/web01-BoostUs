'use client';

import { useStoriesContext } from '@/features/stories/model/stories.context';
import DropdownChip from '@/features/stories/ui/ListDropdown/DropdownChip';
import DropdownTitle from '@/features/stories/ui/ListDropdown/DropdownTitle';
import { motion } from 'framer-motion';
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
  const { sortBy, setSortBy, period, setPeriod } = useStoriesContext();

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
          <div className="flex flex-col gap-2 px-3 py-2">
            <div className="flex w-full flex-row gap-2">
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
            <div className="bg-neutral-surface-default flex h-8 w-full flex-row justify-between gap-2 rounded-lg px-1 py-1">
              {PERIOD_OPTIONS.map((option) => {
                const isSelected = period === option.key;

                return (
                  <button
                    key={option.key}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPeriod(option.key);
                    }}
                    className="relative flex w-full cursor-pointer items-center justify-center rounded-lg transition-colors duration-300"
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="dropdown-active-pill"
                        className="bg-neutral-surface-bold shadow-default absolute inset-0 rounded-lg"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${
                        isSelected
                          ? 'text-string-14 text-neutral-text-strong'
                          : 'text-body-14 text-neutral-text-weak'
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesListDropdown;
