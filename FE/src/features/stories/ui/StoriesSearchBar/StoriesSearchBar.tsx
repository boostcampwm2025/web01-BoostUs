import { Search } from 'lucide-react';

const StoriesSearchBar = () => {
  return (
    <div className="flex flex-row items-center w-full px-2 mt-8 border h-15 border-neutral-border-default bg-neutral-surface-bold rounded-2xl">
      <Search className="text-neutral-text-weak" strokeWidth={1} />
      <input
        type="text"
        placeholder="글 검색..."
        className="w-full ml-2 text-regular-16 text-neutral-text-default focus:outline-none placeholder:text-neutral-text-weak bg-neutral-surface-bold"
      />
    </div>
  );
};

export default StoriesSearchBar;
