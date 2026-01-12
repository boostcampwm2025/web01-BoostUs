'use client';

import { useStoriesRankingToggle } from '@/features/stories/model/useStoriesRankingToggle';
import StoriesHeader from '@/features/stories/ui/Header';
import StoriesList from '@/features/stories/ui/List';
import StoriesSearchBar from '@/features/stories/ui/SearchBar';
import StoriesRanking from '@/features/stories/ui/StoriesRanking/Ranking';

const StoriesPageContent = () => {
  const { isRankingOpen, rankingToggle } = useStoriesRankingToggle();

  return (
    <div className="flex flex-col w-full font-sans max-w-7xl">
      <StoriesHeader />
      <div
        className={`mt-8 ${isRankingOpen ? 'grid grid-cols-[7fr_3fr] gap-8' : 'flex flex-col relative'}`}
      >
        <div className="flex flex-col w-full gap-8">
          <StoriesSearchBar />
          <StoriesList isExpanded={!isRankingOpen} />
        </div>
        <div className={!isRankingOpen ? 'absolute top-0 right-0 z-10' : ''}>
          <StoriesRanking
            isRankingOpen={isRankingOpen}
            rankingToggle={rankingToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default StoriesPageContent;
