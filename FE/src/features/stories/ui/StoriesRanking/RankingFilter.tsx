'use client';

import { useStoriesContext } from '@/features/stories/model';
import { motion } from 'framer-motion';

const FILTER_OPTIONS = [
  { key: 'daily', label: '오늘' },
  { key: 'weekly', label: '주간' },
  { key: 'monthly', label: '월간' },
  { key: 'all', label: '전체' },
] as const;

const RankingFilter = () => {
  const { rankingPeriod, setRankingPeriod } = useStoriesContext();

  const currentSelection = FILTER_OPTIONS.some(
    (opt) => opt.key === rankingPeriod
  )
    ? rankingPeriod
    : 'all';

  return (
    <div className="bg-neutral-surface-default flex h-10 w-full flex-row justify-between gap-2 rounded-lg px-1 py-1">
      {FILTER_OPTIONS.map((option) => {
        const isSelected = currentSelection === option.key;

        return (
          <button
            key={option.key}
            onClick={() => setRankingPeriod(option.key)}
            className="relative flex w-full cursor-pointer items-center justify-center rounded-lg transition-colors duration-300"
          >
            {isSelected && (
              <motion.div
                layoutId="active-pill"
                className="bg-neutral-surface-bold shadow-default absolute inset-0 rounded-lg"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
  );
};

export default RankingFilter;
