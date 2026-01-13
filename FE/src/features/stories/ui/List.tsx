import StoriesCard from '@/features/stories/ui/Card';
import StoriesListDropdown from '@/features/stories/ui/ListDropdown';
import storiesMock from '@/features/stories/api/storiesMock.json';

interface StoriesListProps {
  isExpanded: boolean;
}

const StoriesList = ({ isExpanded }: StoriesListProps) => {
  const stories = storiesMock.data.items;

  return (
    <section className="flex w-full flex-col items-end gap-4">
      <StoriesListDropdown />
      <div
        className={`grid w-full ${isExpanded ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}
      >
        {stories.map((story) => (
          <StoriesCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
};

export default StoriesList;
