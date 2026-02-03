'use client';

import StoriesCard from '@/features/stories/ui/Card/Card';
import FeedHeader from '@/features/main/feed/FeedHeader';
import { useEffect, useState } from 'react';
import { fetchRecoStory } from '@/features/main/reco/api/fetchRecoStory';
import { Story } from '@/features/stories/model/stories.type';
import { toast } from '@/shared/utils/toast';

const FeedSection = () => {
  const [Stories, setStories] = useState<Story[] | null>(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const response = await fetchRecoStory({
          sortBy: 'views',
          period: 'all',
          size: 8,
        });

        if (response?.data?.items && response.data.items.length > 0) {
          setStories(response.data.items);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    void loadStories();
  }, []);

  return (
    <>
      <FeedHeader />
      <section className="grid w-full grid-cols-1 gap-8 mt-4 mb-12 md:grid-cols-3 lg:grid-cols-4">
        {Stories?.map((story) => (
          <StoriesCard id={story.id} key={story.id} story={story} />
        ))}
      </section>

      {/*boostAd section*/}
      <div data-boostad-zone style={{ width: '100%', height: '100%' }}></div>
    </>
  );
};

export default FeedSection;
