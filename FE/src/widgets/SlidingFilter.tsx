'use client';

import { motion } from 'framer-motion';

interface FilterOption<T extends string | number> {
  key: T;
  label: string;
}

interface SlidingFilterProps<T extends string | number> {
  options: readonly FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  layoutId?: string; // framer-motion 전용 (여러 필터가 한 페이지에 있을 때 애니메이션 충돌 방지)
  className?: string; // 컨테이너 스타일 오버라이딩
}

const SlidingFilter = <T extends string | number>({
  options,
  value,
  onChange,
  layoutId = 'active-pill',
  className = '',
}: SlidingFilterProps<T>) => {
  return (
    <div
      className={`bg-neutral-surface-strong flex w-full flex-row justify-between gap-2 rounded-lg px-1 py-1 ${className}`}
    >
      {options.map((option) => {
        const isSelected = value === option.key;

        return (
          <button
            key={option.key}
            onClick={(e) => {
              e.stopPropagation();
              onChange(option.key);
            }}
            className="relative flex w-full cursor-pointer items-center justify-center rounded-lg transition-colors duration-300"
          >
            {isSelected && (
              <motion.div
                layoutId={layoutId}
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

export default SlidingFilter;
