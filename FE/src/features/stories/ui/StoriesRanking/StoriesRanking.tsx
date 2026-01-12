'use client';

import { useStoriesRanking } from '../../model/useStoriesRanking';
import StoriesRankingDropdown from '../StoriesRankingDropdown/StoriesRankingDropdown';
import StoriesRankingToggle from '../StoriesRankingToggle.tsx/StoriesRankingToggle';

const StoriesRanking = () => {
  const { isOpen, selected, toggleDropdown, options } = useStoriesRanking();

  return (
    <div className="flex flex-col w-full px-2 py-4 border border-neutral-border-default rounded-2xl bg-neutral-surface-bold">
      <div className="flex flex-row items-center justify-between">
        <StoriesRankingDropdown
          selected={selected}
          toggleDropdown={toggleDropdown}
        />
        <StoriesRankingToggle />
      </div>
    </div>
  );
};

export default StoriesRanking;
