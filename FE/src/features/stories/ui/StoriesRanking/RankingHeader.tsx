'use client';

import RankingFilter from '@/features/stories/ui/StoriesRanking/RankingFilter';
import StoriesRankingToggle from '@/features/stories/ui/StoriesRanking/RankingToggle';

interface StoriesRankingHeaderProps {
  isRankingOpen: boolean;
  rankingToggle: () => void;
}

const StoriesRankingHeader = ({
  isRankingOpen,
  rankingToggle,
}: StoriesRankingHeaderProps) => {
  return (
    <header
      className={`${isRankingOpen ? 'h-auto gap-4 border-b pt-3 pb-4' : 'h-15'} border-b-neutral-border-default flex flex-col items-center justify-center gap-4 px-3`}
    >
      <div className="flex w-full flex-row justify-between">
        <h2 className="text-neutral-text-strong text-display-24">인기글</h2>
        <StoriesRankingToggle
          isRankingOpen={isRankingOpen}
          onRankingToggle={rankingToggle}
        />
      </div>
      {isRankingOpen && <RankingFilter />}
    </header>
  );
};

export default StoriesRankingHeader;
