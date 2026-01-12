import StoriesCard from '@/features/stories/ui/Card';
import StoriesListDropdown from '@/features/stories/ui/ListDropdown';
import storiesMockData from '@/features/stories/api/storiesMock.json';

const StoriesList = () => {
  const stories = storiesMockData.data.items;

  return (
    <section className="flex flex-col items-end gap-4">
      <StoriesListDropdown />
      <div className="grid w-full grid-cols-3 gap-4">
        {stories.map((story) => (
          <StoriesCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
};

export default StoriesList;
