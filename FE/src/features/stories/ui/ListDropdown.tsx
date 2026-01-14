import { useStoriesContext } from '@/features/stories/model/stories.context';
import { ChevronDown } from 'lucide-react';

const StoriesListDropdown = () => {
  const { sortOption, setSortOption } = useStoriesContext();

  return (
    <button className="text-neutral-text-default flex cursor-pointer flex-row">
      <span className="text-string-16">최신순</span>
      <ChevronDown strokeWidth={1} />
    </button>
  );
};

export default StoriesListDropdown;
