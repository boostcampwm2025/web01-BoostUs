'use client';

import { useRankingButtonVisibility } from '@/features/stories/model/useRankingButtonVisibility';
import { useStoriesUIContext } from '@/features/stories/model/stories.ui.context';
import { AnimatePresence, motion } from 'framer-motion';

const RankingToggleButton = () => {
  const { isRankingOpen, toggleRanking } = useStoriesUIContext();
  const isHidden = useRankingButtonVisibility(isRankingOpen);

  return (
    <AnimatePresence>
      {!isRankingOpen && !isHidden && (
        <motion.button
          key="ranking-toggle-btn"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleRanking}
          className="fixed right-0 top-30 w-10 h-20 bg-brand-surface-default hover:opacity-90 active:opacity-80 transition-opacity duration-150 cursor-pointer rounded-l-xl flex items-center justify-center font-sans text-sm z-50"
        >
          <span className="text-brand-text-on-default text-display-16 [writing-mode:vertical-rl] [text-orientation:upright]">
            랭킹
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default RankingToggleButton;
