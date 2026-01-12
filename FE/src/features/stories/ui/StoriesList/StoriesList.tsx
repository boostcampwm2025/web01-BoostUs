import StoriesCard from '../StoriesCard/StoriesCard';
import StoriesListDropdown from '../StoriesListDropdown/StoriesListDropdown';
import storiesMockData from '../../api/storiesMock.json';

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
