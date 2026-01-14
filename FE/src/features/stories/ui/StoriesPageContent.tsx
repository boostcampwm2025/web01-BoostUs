'use client';

import { StoriesProvider, useStoriesContext } from '@/features/stories/model';
import { Story } from '@/features/stories/model/stories.type';
import StoriesHeader from '@/features/stories/ui/Header';
import StoriesList from '@/features/stories/ui/List';
import StoriesSearchBar from '@/features/stories/ui/SearchBar';
import StoriesRanking from '@/features/stories/ui/StoriesRanking/Ranking';

interface StoriesPageContentProps {
  initialStories: Story[];
}

interface StoriesLayoutProps {
  initialStories: Story[];
}

const StoriesLayout = ({ initialStories }: StoriesLayoutProps) => {
  const { isRankingOpen } = useStoriesContext();

  return (
    <div className="flex w-full max-w-7xl flex-col font-sans">
      <StoriesHeader />

      {isRankingOpen ? (
        <div className="mt-8 grid grid-cols-[7fr_3fr] items-start gap-8">
          <div className="flex flex-col gap-8">
            <StoriesSearchBar />
            <StoriesList initialStories={initialStories} />
          </div>
          <div className="z-10">
            <StoriesRanking />
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-[7fr_3fr] items-start gap-8">
          <div className="col-span-1">
            <StoriesSearchBar />
          </div>
          <div className="col-start-2 row-span-1">
            <div className="z-10">
              <StoriesRanking />
            </div>
          </div>
          <div className="col-span-2 row-start-2">
            <StoriesList initialStories={initialStories} />
          </div>
        </div>
      )}
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
