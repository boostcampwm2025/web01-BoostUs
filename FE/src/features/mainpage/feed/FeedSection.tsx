'use client';

import StoriesCard from '@/features/stories/ui/Card/Card';
import FeedHeader from '@/features/mainpage/feed/FeedHeader';
import { useEffect, useState } from 'react';
import { fetchRecoStory } from '@/features/main/reco/api/fetchRecoStory';
import Contribute from '@/features/main/contribute/Contribute';
import MainQnaSection from '@/features/main/qna/ui/MainQnaSection';
import Link from 'next/link';
import { Story } from '@/features/stories/model/stories.type';

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
      <section>{/* TODO: BoostAd 서비스 추가하기 */}</section>

      <section className="flex flex-col lg:flex-row gap-6 w-full">
        {/* 질문 & 답변 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 justify-between mb-4">
            <h2 className="text-display-24 text-neutral-text-strong">
              질문 & 답변
            </h2>
            <Link
              href="/questions"
              className="text-neutral-text-weak hover:text-neutral-text-strong text-string-16 transition-colors duration-150 flex flex-row items-center gap-1"
            >
              더보기 &rarr;
            </Link>
          </div>
          <MainQnaSection />
        </div>

        {/* 기여하기 50% */}
        <div className="flex-1 min-w-0">
          <Contribute />
        </div>
      </section>
    </>
  );
};

export default FeedSection;
