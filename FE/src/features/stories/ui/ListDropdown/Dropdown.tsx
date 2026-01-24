'use client';

import { useStoriesContext } from '@/features/stories/model/stories.context';
import DropdownChip from '@/features/stories/ui/ListDropdown/DropdownChip';
import { AnimatePresence, motion } from 'framer-motion';
import SlidingFilter from '@/widgets/SlidingFilter';
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from '@/shared/ui/Dropdown';

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

  const currentLabel =
    sortBy === 'latest'
      ? SORT_BY_OPTIONS.find((option) => option.key === sortBy)?.label
      : `${SORT_BY_OPTIONS.find((option) => option.key === sortBy)?.label ?? ''} (${PERIOD_OPTIONS.find((option) => option.key === period)?.label ?? ''})`;

  return (
    <Dropdown>
      <DropdownTrigger label={currentLabel} />
      <DropdownContent className="w-58">
        <div className="flex flex-col px-3 py-2">
          {/* 정렬 칩 영역 */}
          <motion.div layout="position" className="flex w-full flex-row gap-2">
            {SORT_BY_OPTIONS.map((option) => (
              <DropdownChip
                key={option.key}
                onClick={() => setSortBy(option.key)}
                isActive={sortBy === option.key}
                label={option.label}
              />
            ))}
          </motion.div>

          {/* 기간 필터 영역 (최신순이 아닐 때만 노출) */}
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
      </DropdownContent>
    </Dropdown>
  );
};

export default StoriesListDropdown;
