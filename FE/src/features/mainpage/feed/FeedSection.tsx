'use client';

import StoriesCard from '@/features/stories/ui/Card/Card';
import FeedHeader from '@/features/mainpage/feed/FeedHeader';
import { useEffect, useState } from 'react';
import { fetchRecoStory } from '@/features/main/reco/api/fetchRecoStory';
import type { StoriesCard as StoriesCardType } from '@/features/stories/model/stories.type';

const FeedSection = () => {
  const [Stories, setStories] = useState<StoriesCardType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageError, setIsImageError] = useState(false);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setIsLoading(true);
        const response = await fetchRecoStory({
          sortBy: 'views',
          period: 'all',
          size: 6,
        });

        if (response?.data?.items && response.data.items.length > 0) {
          setStories(response.data.items);
        }
      } catch (error) {
        console.error('추천 스토리 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, []);

  return (
    <>
      <FeedHeader />
      <section className="gap-16 columns-3 mt-4 mb-8 w-full">
        {Stories?.map((story) => (
          <div key={story.id} className={'mb-8'}>
            <StoriesCard id={story.id} key={story.id} story={story} />
          </div>
        ))}
      </section>
    </>
  );
};

export default FeedSection;
