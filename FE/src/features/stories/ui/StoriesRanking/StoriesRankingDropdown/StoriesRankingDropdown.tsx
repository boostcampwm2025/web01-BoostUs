'use client';

import { StoriesRankingPeriods } from '@/features/stories/model/types';
import { ChevronDown } from 'lucide-react';

interface StoriesRankingDropdownProps {
  isDropdownOpen: boolean;
  selected: StoriesRankingPeriods;
  options: StoriesRankingPeriods[];
  onToggleDropdown: () => void;
  onSelectOption: (option: StoriesRankingPeriods) => void;
}

const StoriesRankingDropdown = ({
  isDropdownOpen,
  selected,
  options,
  onToggleDropdown: toggleDropdown,
  onSelectOption: onSelectOption,
}: StoriesRankingDropdownProps) => {
  return (
    <div className="flex flex-row gap-1">
      <button
        type="button"
        className="flex flex-row items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="text-neutral-text-strong text-display-24">
          {selected}
        </span>
        <ChevronDown
          className="text-neutral-text-strong"
          strokeWidth={1}
          size={30}
        />
      </button>
      <span className="text-neutral-text-strong text-display-24">인기글</span>
    </div>
  );
};

export default StoriesRankingDropdown;
