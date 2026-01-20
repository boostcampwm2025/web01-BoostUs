'use client';

import { useStoriesContext } from '@/features/stories/model';
import StoriesRankingCard from '@/features/stories/ui/StoriesRanking/RankingCard';
import StoriesRankingHeader from '@/features/stories/ui/StoriesRanking/RankingHeader';
import { Variants, motion } from 'framer-motion';

// 애니메이션 정의
const rankingVariants: Variants = {
  hidden: { x: 50, opacity: 0 }, // 닫혀있을 때: 오른쪽으로 50px 이동, 투명
  visible: { x: 0, opacity: 1 }, // 열려있을 때: 제자리, 불투명
  exit: { x: 50, opacity: 0 }, // 사라질 때: 다시 오른쪽으로 이동하며 투명해짐
};

const StoriesRanking = () => {
  const { isRankingOpen } = useStoriesContext();

  // TODO: 실제 데이터로 교체 필요
  const cards = Array.from({ length: 5 }, (_, index) => index);

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
        cards.map((index) => (
          <StoriesRankingCard
            key={index}
            hasBorder={index !== cards.length - 1}
          />
        ))}
    </motion.section>
  );
};

export default StoriesRanking;
