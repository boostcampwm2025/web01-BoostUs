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
      <div className="grid grid-cols-[7fr_3fr] gap-8 mt-8 items-start">
        <div className="col-span-1">
          <StoriesSearchBar />
        </div>
        <div
          className={`col-start-2 ${
            isRankingOpen ? 'row-span-2' : 'row-span-1'
          }`}
        >
          <div className="sticky top-8 z-10">
            <StoriesRanking
              isRankingOpen={isRankingOpen}
              rankingToggle={rankingToggle}
            />
          </div>
        </div>

        <div
          className={`row-start-2 ${
            isRankingOpen ? 'col-span-1' : 'col-span-2'
          }`}
        >
          <StoriesList isExpanded={!isRankingOpen} />
        </div>
      </div>
    </div>
  );
};

export default StoriesPageContent;
