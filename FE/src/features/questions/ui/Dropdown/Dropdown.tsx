'use client';

import {
  QuestionsSortBy,
  useQuestionsContext,
} from '@/features/questions/model';
import DropdownSelect from '@/features/questions/ui/Dropdown/DropdownSelect';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const SORT_BY_OPTIONS = [
  { key: 'latest', label: '최신순' },
  { key: 'likes', label: '인기순' },
  { key: 'views', label: '조회순' },
] as const;

const Dropdown = () => {
  const { sort, setSort } = useQuestionsContext();
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
    <div ref={dropdownRef} className="flex justify-end">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-neutral-text-default hover:text-neutral-text-strong transition-colors duration-150 flex cursor-pointer flex-row whitespace-nowrap"
      >
        <span className="text-string-16">
          {SORT_BY_OPTIONS.find((option) => option.key === sort)?.label}
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
            className="bg-neutral-surface-bold shadow-default border border-neutral-border-default absolute z-20 mt-7 flex w-40 origin-top flex-col overflow-hidden rounded-2xl"
          >
            <div className="flex flex-col divide-y divide-neutral-border-default">
              {SORT_BY_OPTIONS.map((option) => (
                <DropdownSelect
                  key={option.key}
                  onSelect={() => setSort(option.key as QuestionsSortBy)}
                  isSelected={sort === option.key}
                  label={option.label}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
