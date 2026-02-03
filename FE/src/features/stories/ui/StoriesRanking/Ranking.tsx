'use client';

import { useStoriesContext } from '@/features/stories/model';
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

  // TODO: 실제 랭킹 API 연결 후 랭킹 데이터 사용

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={rankingVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="border-neutral-border-default bg-neutral-surface-bold flex w-full h-fit flex-col rounded-2xl border"
    >
      <StoriesRankingHeader />
      {isRankingOpen && (
        <div className="w-full min-h-125 flex items-center justify-center text-body-16 text-neutral-text-weak">
          준비 중입니다.
        </div>
      )}
    </motion.section>
  );
};

export default StoriesRanking;
