'use client';

import { useStoriesContext } from '@/features/stories/model/stories.context';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const StoriesSearchBar = () => {
  const { searchQuery, setSearchQuery } = useStoriesContext();
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (inputValue === searchQuery) return;

    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, setSearchQuery]);

  return (
    <div className="border-neutral-border-default bg-neutral-surface-bold flex h-10 w-full flex-row items-center rounded-lg border px-3 py-2.5">
      <Search className="text-neutral-text-weak" strokeWidth={1} size={20} />
      <input
        type="text"
        aria-label="글 검색 바"
        placeholder="글 검색..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="text-body-16 text-neutral-text-default placeholder:text-neutral-text-weak bg-neutral-surface-bold ml-2 w-full focus:outline-none"
      />
    </div>
  );
};

export default StoriesSearchBar;
