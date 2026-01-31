'use client';

import StoriesCard from '@/features/stories/ui/Card/Card';
import FeedHeader from '@/features/main/FeedHeader';
import { useEffect, useState } from 'react';
import { fetchRecoStory } from '@/features/main/reco/api/fetchRecoStory';
import Contribute from '@/features/main/contribute/Contribute';
import MainQnaSection from '@/features/main/qna/ui/MainQnaSection';
import Link from 'next/link';
import { Story } from '@/features/stories/model/stories.type';
import MainBelowSection from '@/features/main/MainBelowSection';

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
        console.error('추천 스토리 로딩 실패:', error);
      }
    };

    void loadStories();
  }, []);

  return (
    <>
      <FeedHeader />
      <section className="gap-8 md:columns-3 lg:columns-4 mt-4 mb-8 w-full">
        {Stories?.map((story) => (
          <div key={story.id} className={'mb-8'}>
            <StoriesCard id={story.id} key={story.id} story={story} />
          </div>
        ))}
      </section>

      {/*boostAd seciton*/}
      <div data-boostad-zone style={{ width: '100%', height: '100%' }}></div>
    </>
  );
};

export default FeedSection;
