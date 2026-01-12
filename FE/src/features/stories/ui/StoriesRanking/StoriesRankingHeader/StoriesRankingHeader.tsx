'use client';

import { StoriesRankingPeriodState } from '@/features/stories/model/types';
import StoriesRankingDropdown from '../StoriesRankingDropdown/StoriesRankingDropdown';
import StoriesRankingToggle from '../StoriesRankingToggle.tsx/StoriesRankingToggle';

interface StoriesRankingHeaderProps extends StoriesRankingPeriodState {
  isRankingOpen: boolean;
  rankingToggle: () => void;
}

const StoriesRankingHeader = ({
  isDropdownOpen,
  toggleDropdown,
  selected,
  selectOption,
  options,
  isRankingOpen,
  rankingToggle,
}: StoriesRankingHeaderProps) => {
  return (
    <div
      className={`h-15 ${isRankingOpen ? 'border-b' : ''} border-b-neutral-border-default flex px-2 py-4 flex-row items-center justify-between`}
    >
      <StoriesRankingDropdown
        isDropdownOpen={isDropdownOpen}
        selected={selected}
        options={options}
        onToggleDropdown={toggleDropdown}
        onSelectOption={selectOption}
      />
      <StoriesRankingToggle
        isRankingOpen={isRankingOpen}
        rankingToggle={rankingToggle}
      />
    </div>
  );
};

export default StoriesRankingHeader;
