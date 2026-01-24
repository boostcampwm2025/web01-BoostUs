'use client';

import { useStoriesContext } from '@/features/stories/model/stories.context';
import DropdownChip from '@/features/stories/ui/ListDropdown/DropdownChip';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import SlidingFilter from '@/widgets/SlidingFilter';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-neutral-text-default hover:text-neutral-text-strong transition-colors duration-150 flex cursor-pointer flex-row whitespace-nowrap"
      >
        <span className="text-string-16">
          {sortBy === 'latest'
            ? SORT_BY_OPTIONS.find((option) => option.key === sortBy)?.label
            : `${SORT_BY_OPTIONS.find((option) => option.key === sortBy)?.label ?? ''} (${PERIOD_OPTIONS.find((option) => option.key === period)?.label ?? ''})`}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown strokeWidth={1} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, scaleY: 0, y: -10 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="bg-neutral-surface-bold border border-neutral-border-default shadow-default absolute right-0 z-20 mt-4 flex w-58 origin-top flex-col overflow-hidden rounded-2xl"
          >
            <div className="flex flex-col px-3 py-2">
              <motion.div
                layout="position"
                className="flex w-full flex-row gap-2"
              >
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
              </motion.div>
              <AnimatePresence mode="popLayout">
                {sortBy !== 'latest' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2">
                      <SlidingFilter
                        options={PERIOD_OPTIONS}
                        value={period ?? 'all'}
                        onChange={setPeriod}
                        layoutId="dropdown-period-pill"
                        className="h-8"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoriesListDropdown;
