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
    staleTime: 1000 * 60 * 60,
  });

  const feedItems = response?.data?.items ?? [];
  // 상단 추천 스토리(1개)와 중복되지 않도록 피드에서는 첫 항목을 제외합니다.
  const stories = feedItems.slice(1, FEED_PARAMS.size);

  return (
    <>
      <FeedHeader />
      <section className="mt-4 mb-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
