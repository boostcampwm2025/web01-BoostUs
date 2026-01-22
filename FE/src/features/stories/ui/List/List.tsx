'use client';

import StoriesCard from '@/features/stories/ui/Card/Card';
import { useStoriesContext } from '@/features/stories/model';
import { useEffect } from 'react';
import { Story } from '@/features/stories/model/stories.type';
import { useInView } from 'react-intersection-observer';
import { useStoriesInfiniteQuery } from '@/features/stories/model/useStoriesInfiniteQuery';

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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useStoriesInfiniteQuery({
      sortBy,
      period: period ?? 'all',
      searchQuery,
    });

  // 감지된 경우 다음 페이지 데이터 요청
  useEffect(() => {
    // 마지막 페이지가 아니고(hasNextPage), 현재 로딩중이 아니며, 요소가 보일 때
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 데이터 플래트닝 (Pages 배열 -> 하나의 Story 배열로 변환)
  // data.pages는 [{ items: [...] }, { items: [...] }] 형태이므로 이를 평탄화해야 함
  // 클라이언트 상태(data)가 없으면 초기 데이터(initialStories) 사용
  const stories = data
    ? data.pages.flatMap((page) => page.data.items)
    : initialStories;

  return (
    <section className="flex w-full flex-col items-end gap-4">
      <div
        className={`grid w-full ${!isRankingOpen ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}
      >
        {stories.length > 0 ? (
          stories.map((story) => (
            <StoriesCard id={story.id} key={story.id} story={story} />
          ))
        ) : (
          <div className="text-neutral-text-weak col-span-full py-10 text-center">
            {status === 'pending' ? '로딩 중...' : '검색 결과가 없습니다.'}
          </div>
        )}
      </div>

      {/* 무한 스크롤 트리거 (Sentinel) */}
      {/* 데이터가 있고, 다음 페이지가 존재할 때만 렌더링하여 불필요한 호출 방지 */}
      {hasNextPage && (
        <div
          ref={ref}
          className="h-10 w-full flex justify-center items-center mt-4"
        >
          {isFetchingNextPage && (
            <span className="text-neutral-text-weak text-body-14">
              더 불러오는 중...
            </span>
          )}
        </div>
      )}
    </section>
  );
};

export default StoriesList;
