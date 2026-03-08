'use client';

import { useStoriesUIContext } from '@/features/stories/model/stories.ui.context';
import StoriesList from '@/features/stories/ui/List/List';
import StoriesListDropdown from '@/features/stories/ui/ListDropdown/Dropdown';
import StoriesSearchBar from '@/features/stories/ui/SearchBar/SearchBar';
import StoriesRanking from '@/features/stories/ui/StoriesRanking/Ranking';
import RankingToggleButton from '@/features/stories/ui/RankingToggleButton';
import PageHeader from '@/shared/ui/PageHeader';
import { BlogRegistrationButton } from '@/features/feed/ui/BlogRegistrationButton';
import { AnimatePresence, motion } from 'framer-motion';

const StoriesLayout = () => {
  const { isRankingOpen } = useStoriesUIContext();

  return (
    <div className="flex w-full max-w-7xl flex-col font-sans">
      <PageHeader
        title="캠퍼들의 이야기"
        subtitle="캠퍼들의 기술, 경험, 회고, 면접 팁 등의 이야기"
      />
      <motion.div
        layout
        layoutDependency={isRankingOpen}
        className={`mt-8 grid items-start gap-8 ${isRankingOpen ? 'grid-cols-[7fr_3fr]' : 'grid-cols-1'}`}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="gap-10 flex flex-col">
          <div className="flex flex-row items-center gap-4">
            <StoriesSearchBar />
            <StoriesListDropdown />
            <BlogRegistrationButton />
          </div>
          <StoriesList />
        </div>
        <AnimatePresence mode="popLayout">
          {isRankingOpen && <StoriesRanking />}
        </AnimatePresence>
      </motion.div>
      <RankingToggleButton />
    </div>
  );
};

export default StoriesLayout;
