'use client';

import { StoriesProvider, useStoriesContext } from '@/features/stories/model';
import { Story } from '@/features/stories/model/stories.type';
import StoriesHeader from '@/features/stories/ui/Header/Header';
import StoriesList from '@/features/stories/ui/List/List';
import StoriesSearchBar from '@/features/stories/ui/SearchBar/SearchBar';
import StoriesRanking from '@/features/stories/ui/StoriesRanking/Ranking';

interface StoriesPageContentProps {
  initialStories: Story[];
}

const StoriesLayout = ({ initialStories }: { initialStories: Story[] }) => {
  const { isRankingOpen } = useStoriesContext();

  return (
    <div className="flex w-full max-w-7xl flex-col font-sans">
      <StoriesHeader />

      <div className="mt-8 grid grid-cols-[7fr_3fr] items-start gap-8">
        <div className={isRankingOpen ? 'flex flex-col gap-8' : 'col-span-1'}>
          <StoriesSearchBar />
          {isRankingOpen && <StoriesList initialStories={initialStories} />}
        </div>
        <div className={isRankingOpen ? 'z-10' : 'z-10 col-start-2 row-span-1'}>
          <StoriesRanking />
        </div>
        {!isRankingOpen && (
          <div className="col-span-2 row-start-2">
            <StoriesList initialStories={initialStories} />
          </div>
        )}
      </div>
    </div>
  );
};

const StoriesPageContent = ({ initialStories }: StoriesPageContentProps) => {
  return (
    <StoriesProvider>
      <StoriesLayout initialStories={initialStories} />
    </StoriesProvider>
  );
};

export default StoriesPageContent;
