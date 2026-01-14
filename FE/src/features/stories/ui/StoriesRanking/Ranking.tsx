'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStoriesContext } from '@/features/stories/model';
import StoriesRankingCard from '@/features/stories/ui/StoriesRanking/RankingCard';
import StoriesRankingHeader from '@/features/stories/ui/StoriesRanking/RankingHeader';

const StoriesRanking = () => {
  const { isRankingOpen } = useStoriesContext();

  // TODO: 실제 데이터로 교체 필요
  const cards = Array.from({ length: 5 }, (_, index) => index);

  return (
    <section className="border-neutral-border-default bg-neutral-surface-bold flex h-fit w-full flex-col overflow-hidden rounded-2xl border">
      <StoriesRankingHeader />
      <AnimatePresence initial={false}>
        {isRankingOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: 'easeInOut' },
              opacity: { duration: 0.2, ease: 'easeInOut' },
            }}
          >
            {cards.map((index) => (
              <StoriesRankingCard
                key={index}
                hasBorder={index !== cards.length - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StoriesRanking;
