'use client';

import { useStoriesContext } from '@/features/stories/model';
import { Story } from '@/features/stories/model/stories.type';
import StoriesRankingCard from '@/features/stories/ui/StoriesRanking/RankingCard';
import StoriesRankingHeader from '@/features/stories/ui/StoriesRanking/RankingHeader';
import { Variants, motion } from 'framer-motion';
import { useMemo } from 'react';

// 애니메이션 정의
const rankingVariants: Variants = {
  hidden: { x: 50, opacity: 0 }, // 닫혀있을 때: 오른쪽으로 50px 이동, 투명
  visible: { x: 0, opacity: 1 }, // 열려있을 때: 제자리, 불투명
  exit: { x: 50, opacity: 0 }, // 사라질 때: 다시 오른쪽으로 이동하며 투명해짐
};

const StoriesRanking = ({ initialStories }: { initialStories: Story[] }) => {
  const { isRankingOpen } = useStoriesContext();

  // TODO: 실제 랭킹 API 연결 후 initialStories 대신 랭킹 데이터 사용
  const rankedStories = useMemo(() => {
    // 좋아요 높은 순으로 정렬하고 상위 5개 추출
    return [...initialStories]
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 5);
  }, [initialStories]);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={rankingVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }} // 자연스러운 스프링 효과
      className="border-neutral-border-default bg-neutral-surface-bold flex h-fit w-full flex-col rounded-2xl border"
    >
      <StoriesRankingHeader />
      {isRankingOpen &&
        rankedStories.map((story, index) => (
          <StoriesRankingCard
            key={story.id}
            story={story}
            hasBorder={index !== rankedStories.length - 1}
          />
        ))}
    </motion.section>
  );
};

export default StoriesRanking;
