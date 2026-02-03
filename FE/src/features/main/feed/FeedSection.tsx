'use client';

import StoriesCard from '@/features/stories/ui/Card/Card';
import FeedHeader from '@/features/main/feed/FeedHeader';
import {
  FEED_PARAMS,
  FEED_QUERY_KEY,
  fetchRecoStory,
} from '@/features/main/reco/api/fetchRecoStory';
import { useQuery } from '@tanstack/react-query';

const FeedSection = () => {
  const { data: response } = useQuery({
    queryKey: FEED_QUERY_KEY,
    queryFn: () => fetchRecoStory(FEED_PARAMS),
    staleTime: 1000 * 60 * 5,
  });

  const stories = response?.data?.items ?? [];

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
