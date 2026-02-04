'use client';

import StoriesCard from '@/features/stories/ui/Card/Card';
import { useStoriesContext } from '@/features/stories/model';
import { useEffect } from 'react';
import { Story } from '@/features/stories/model/stories.type';
import { useInView } from 'react-intersection-observer';
import { useStoriesInfiniteQuery } from '@/features/stories/model/useStoriesInfiniteQuery';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import Button from '@/shared/ui/Button/Button';

interface StoriesListProps {
  initialStories: Story[]; // SSR로 받아온 초기 데이터 (Hydration 용)
}

const StoriesList = ({ initialStories }: StoriesListProps) => {
  const { isRankingOpen, searchQuery, sortBy, period } = useStoriesContext();

  // 화면에 요소가 보이는지 감지하는 훅
  const { ref, inView } = useInView({
    threshold: 0, // 요소가 1px이라도 보이면 감지
  });

  // TanStack Query 훅 사용
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isError,
    error,
  } = useStoriesInfiniteQuery({
    sortBy,
    period: period ?? 'all',
    searchQuery,
  });

  // 데이터 플래트닝 (Pages 배열 -> 하나의 Story 배열로 변환)
  // 클라이언트 상태(data)가 없으면 초기 데이터(initialStories) 사용
  const stories = data
    ? data.pages.flatMap((page) => page.data.items)
    : initialStories;

  // 무한 스크롤 트리거
  useEffect(() => {
    // 뷰포트에 들어왔고, 마지막 페이지가 아니고(hasNextPage), 현재 로딩중이 아니며, 에러 상태가 아닐 때
    if (inView && hasNextPage && !isFetchingNextPage && !isError) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, isError]);

  return (
    <section className="flex w-full flex-col items-end gap-4">
      <div
        className={`grid w-full ${!isRankingOpen ? 'grid-cols-4' : 'grid-cols-3'} gap-4 lg:gap-8`}
      >
        <AnimatePresence mode="popLayout">
          {stories.length > 0 ? (
            stories.map((story) => (
              <motion.div
                key={story.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <StoriesCard id={story.id} story={story} />
              </motion.div>
            ))
          ) : (
            <motion.div
              layout
              className="text-neutral-text-weak col-span-full py-10 text-center"
            >
              {status === 'pending' ? '로딩 중...' : '검색 결과가 없습니다.'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 에러 핸들링 및 무한 스크롤 트리거 영역 */}
      <div className="w-full flex justify-center mt-8">
        {isError ? (
          // 에러 발생 시: 재시도 버튼 노출
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-status-danger">
              <AlertCircle size={20} className="text-danger-text-default" />
              <span className="text-body-14 font-medium">
                스토리를 불러오는 데 실패했습니다.
              </span>
            </div>
            <Button
              onClick={() => fetchNextPage()}
              buttonStyle="outlined"
              className="gap-2 flex "
            >
              <RefreshCw
                size={16}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              <span>다시 시도</span>
            </Button>
          </div>
        ) : (
          // 정상 상태: 로딩 스피너 또는 Sentinel
          hasNextPage && (
            <div ref={ref} className="h-10 flex items-center justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-neutral-text-weak">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-body-14">더 불러오는 중...</span>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default StoriesList;
