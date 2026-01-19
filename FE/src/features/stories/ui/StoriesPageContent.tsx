'use client';

import { StoriesProvider, useStoriesContext } from '@/features/stories/model';
import { Story } from '@/features/stories/model/stories.type';
import StoriesHeader from '@/features/stories/ui/Header/Header';
import StoriesList from '@/features/stories/ui/List/List';
import StoriesListDropdown from '@/features/stories/ui/ListDropdown/Dropdown';
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
      <div
        className={`mt-8 grid items-start gap-8 ${isRankingOpen ? 'grid-cols-[7fr_3fr]' : 'grid-cols-1'}`}
      >
        <div className="gap-10 flex flex-col">
          <div className="flex flex-row items-center gap-4">
            <StoriesSearchBar />
            <StoriesListDropdown />
          </div>
          <StoriesList initialStories={initialStories} />
        </div>
        {isRankingOpen && <StoriesRanking />}
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
