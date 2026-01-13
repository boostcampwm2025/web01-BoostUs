'use client';

import { motion } from 'framer-motion';
import { useStoriesRankingPeriod } from '@/features/stories/model/useStoriesRanking';

const RankingFilter = () => {
  const { selected, selectOption, options } = useStoriesRankingPeriod();

  return (
    <div className="bg-neutral-surface-default flex h-10 w-full flex-row justify-between gap-2 rounded-lg px-1 py-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => selectOption(option)}
          className="relative flex w-full cursor-pointer items-center justify-center rounded-lg transition-colors duration-300"
        >
          {selected === option && (
            <motion.div
              layoutId="active-pill"
              className="bg-neutral-surface-bold shadow-default absolute inset-0 rounded-lg"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span
            className={`relative z-10 ${
              selected === option
                ? 'text-string-14 text-neutral-text-strong'
                : 'text-body-14 text-neutral-text-weak'
            }`}
          >
            {option}
          </span>
        </button>
      ))}
    </div>
  );
};

export default RankingFilter;
