'use client';

import { StoriesProvider, useStoriesContext } from '@/features/stories/model';
import { Story } from '@/features/stories/model/stories.type';
import StoriesList from '@/features/stories/ui/List/List';
import StoriesListDropdown from '@/features/stories/ui/ListDropdown/Dropdown';
import StoriesSearchBar from '@/features/stories/ui/SearchBar/SearchBar';
import StoriesRanking from '@/features/stories/ui/StoriesRanking/Ranking';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useState } from 'react';
import PageHeader from '@/shared/ui/PageHeader';

interface StoriesPageContentProps {
  initialStories: Story[];
}

const StoriesLayout = ({ initialStories }: StoriesPageContentProps) => {
  const { isRankingOpen, toggleRanking } = useStoriesContext();

  const { scrollY } = useScroll();
  const [isRankingButtonHidden, setIsRankingButtonHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  // 스크롤 감지 로직
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastY;
    setLastY(latest);

    // 1. 랭킹이 열려있으면 숨기지 않음
    if (isRankingOpen) {
      setIsRankingButtonHidden(false);
      return;
    }

    // 2. 스크롤을 내리는 중이고(latest > previous), 스크롤이 일정 이상(100px) 내려갔을 때 -> 숨김
    if (latest > previous && latest > 100) {
      setIsRankingButtonHidden(true);
    }
    // 3. 스크롤을 올리는 중 -> 보임
    else if (latest < previous) {
      setIsRankingButtonHidden(false);
    }
  });

  return (
    <div className="flex w-full max-w-7xl flex-col font-sans">
      <PageHeader
        title={'캠퍼들의 이야기'}
        subtitle={'캠퍼들의 기술, 경험, 회고, 면접 팁 등의 이야기'}
      />
      <motion.div
        layout
        className={`mt-8 grid items-start gap-8 ${isRankingOpen ? 'grid-cols-[7fr_3fr]' : 'grid-cols-1'}`}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.div layout className="gap-10 flex flex-col">
          <div className="flex flex-row items-center gap-4">
            <StoriesSearchBar />
            <StoriesListDropdown />
          </div>
          <StoriesList initialStories={initialStories} />
        </motion.div>
        <AnimatePresence mode="popLayout">
          {isRankingOpen && <StoriesRanking initialStories={initialStories} />}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {!isRankingOpen && !isRankingButtonHidden && (
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
    </div>
  );
};

const StoriesPageContent = ({ initialStories }: StoriesPageContentProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <StoriesProvider>
        <StoriesLayout initialStories={initialStories} />
      </StoriesProvider>
    </QueryClientProvider>
  );
};

export default StoriesPageContent;
