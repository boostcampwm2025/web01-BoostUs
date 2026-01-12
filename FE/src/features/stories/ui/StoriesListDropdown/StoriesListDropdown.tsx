import { ChevronDown } from 'lucide-react';

const StoriesListDropdown = () => {
  return (
    <button className="flex flex-row cursor-pointer text-neutral-text-default">
      <span className="text-string-16">최신순</span>
      <ChevronDown strokeWidth={1} />
    </button>
  );
};

export default StoriesListDropdown;
