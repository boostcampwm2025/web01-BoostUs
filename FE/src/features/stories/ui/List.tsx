import StoriesCard from '@/features/stories/ui/Card';
import StoriesListDropdown from '@/features/stories/ui/ListDropdown';
import storiesMockData from '@/features/stories/api/storiesMock.json';

interface StoriesListProps {
  isExpanded: boolean;
}

const StoriesList = ({ isExpanded }: StoriesListProps) => {
  const stories = storiesMockData.data.items; // TODO: 실제 데이터로 교체

  return (
    <section className="flex flex-col items-end gap-4 w-full">
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
