'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const RankingFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState<
    '오늘' | '주간' | '월간' | '전체'
  >('오늘');

  const filters: ('오늘' | '주간' | '월간' | '전체')[] = [
    '오늘',
    '주간',
    '월간',
    '전체',
  ];

  return (
    <div className="bg-neutral-surface-default flex h-10 w-full flex-row justify-between gap-2 rounded-lg px-1 py-1">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setSelectedFilter(filter)}
          className="relative flex w-full cursor-pointer items-center justify-center rounded-lg transition-colors duration-300"
        >
          {selectedFilter === filter && (
            <motion.div
              layoutId="active-pill"
              className="bg-neutral-surface-bold shadow-default absolute inset-0 rounded-lg"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span
            className={`relative z-10 ${
              selectedFilter === filter
                ? 'text-string-14 text-neutral-text-strong'
                : 'text-body-14 text-neutral-text-weak'
            }`}
          >
            {filter}
          </span>
        </button>
      ))}
    </div>
  );
};

export default RankingFilter;
