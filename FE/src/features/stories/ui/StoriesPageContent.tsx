'use client';

import { StoriesProvider, useStoriesContext } from '@/features/stories/model';
import { Story } from '@/features/stories/model/stories.type';
import StoriesList from '@/features/stories/ui/List/List';
import StoriesListDropdown from '@/features/stories/ui/ListDropdown/Dropdown';
import StoriesSearchBar from '@/features/stories/ui/SearchBar/SearchBar';
import StoriesRanking from '@/features/stories/ui/StoriesRanking/Ranking';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import PageHeader from '@/shared/ui/PageHeader';
import useRankingButtonVisibility from '@/features/stories/model/useRankingButtonVisibility';
import { Link } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import CustomDialog from '@/shared/ui/Dialog/CustomDialog';

interface StoriesPageContentProps {
  initialStories: Story[];
}

const StoriesLayout = ({ initialStories }: StoriesPageContentProps) => {
  const { isRankingOpen, toggleRanking } = useStoriesContext();

  const isRankingButtonHidden = useRankingButtonVisibility(isRankingOpen);

  return (
    <div className="flex w-full max-w-7xl flex-col font-sans">
      <PageHeader
        title="캠퍼들의 이야기"
        subtitle="캠퍼들의 기술, 경험, 회고, 면접 팁 등의 이야기"
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
            <Tooltip>
              <CustomDialog
                dialogTrigger={
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-neutral-text-weak hover:text-brand-surface-default transition-colors duration-150 cursor-pointer"
                    >
                      <Link />
                    </button>
                  </TooltipTrigger>
                }
                dialogTitle="내 블로그 RSS URL 등록하기"
                dialogDescription="내 블로그의 RSS URL을 등록하여, 블로그 글을 자동으로 가져올 수 있습니다."
                dialogContent={
                  <div className="flex flex-col gap-1 mt-2">
                    <input
                      id="rss-url"
                      type="text"
                      placeholder="https://example.com/rss"
                      className="w-full border border-neutral-border-default placeholder:text-neutral-text-weak text-body-16 text-neutral-text-default px-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-brand-surface-default"
                    />
                  </div>
                }
              />
              <TooltipContent>
                <p>내 블로그 RSS URL 등록하기</p>
              </TooltipContent>
            </Tooltip>
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
