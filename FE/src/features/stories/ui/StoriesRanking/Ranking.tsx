'use client';

import { useStoriesRankingPeriod } from '@/features/stories/model/useStoriesRanking';
import StoriesRankingCard from '@/features/stories/ui/StoriesRanking/RankingCard';
import StoriesRankingHeader from '@/features/stories/ui/StoriesRanking/RankingHeader';

interface StoriesRankingProps {
  isRankingOpen: boolean;
  rankingToggle: () => void;
}

const StoriesRanking = ({
  isRankingOpen,
  rankingToggle,
}: StoriesRankingProps) => {
  const { isDropdownOpen, toggleDropdown, selected, selectOption, options } =
    useStoriesRankingPeriod();

  // TODO: 실제 데이터로 교체 필요
  const cards = Array.from({ length: 5 }, (_, index) => index);

  return (
    <section className="h-fit flex flex-col w-full border border-neutral-border-default rounded-2xl bg-neutral-surface-bold">
      <StoriesRankingHeader
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        selected={selected}
        selectOption={selectOption}
        options={options}
        isRankingOpen={isRankingOpen}
        rankingToggle={rankingToggle}
      />
      {isRankingOpen &&
        cards.map((index) => (
          <StoriesRankingCard
            key={index}
            hasBorder={index !== cards.length - 1}
          />
        ))}
    </section>
  );
};

export default StoriesRanking;
