'use client';

import { useStoriesContext } from '@/features/stories/model';
import StoriesRankingCard from '@/features/stories/ui/StoriesRanking/RankingCard';
import StoriesRankingHeader from '@/features/stories/ui/StoriesRanking/RankingHeader';

const StoriesRanking = () => {
  const { isRankingOpen } = useStoriesContext();

  // TODO: 실제 데이터로 교체 필요
  const cards = Array.from({ length: 5 }, (_, index) => index);

  return (
    <section className="border-neutral-border-default bg-neutral-surface-bold flex h-fit w-full flex-col rounded-2xl border">
      <StoriesRankingHeader />
      {isRankingOpen &&
        cards.map((index) => (
          <StoriesRankingCard
            key={index}
            hasBorder={index !== cards.length - 1}
          />
        ))}
    </section>
  );
};

export default StoriesRanking;
