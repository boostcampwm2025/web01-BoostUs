'use client';

import { useStoriesContext } from '@/features/stories/model/stories.context';
import { Search } from 'lucide-react';

const StoriesSearchBar = () => {
  const { searchQuery, setSearchQuery } = useStoriesContext();

  return (
    <div className="w-full">
      <div className="border-neutral-border-default bg-neutral-surface-bold flex h-15 w-full flex-row items-center rounded-2xl border px-2">
        <Search className="text-neutral-text-weak" strokeWidth={1} />
        <input
          type="text"
          placeholder="글 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-body-16 text-neutral-text-default placeholder:text-neutral-text-weak bg-neutral-surface-bold ml-2 w-full focus:outline-none"
        />
      </div>
    </div>
  );
};

export default StoriesSearchBar;
