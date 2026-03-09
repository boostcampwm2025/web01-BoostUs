import StoriesCard from '@/features/stories/ui/Card/Card';
import FeedHeader from '@/features/main/feed/FeedHeader';
import type { Story } from '@/features/stories/model/stories.type';

const FeedSection = ({ stories }: { stories: Story[] }) => {
  return (
    <>
      <FeedHeader />
      <section className="grid w-full grid-cols-1 gap-8 mt-4 mb-12 md:grid-cols-3 lg:grid-cols-4">
        {stories?.map((story) => (
          <StoriesCard id={story.id} key={story.id} story={story} />
        ))}
      </section>

      {/*boostAd section*/}
      <div data-boostad-zone style={{ width: '100%', height: '100%' }}></div>
    </>
  );
};

export default FeedSection;
