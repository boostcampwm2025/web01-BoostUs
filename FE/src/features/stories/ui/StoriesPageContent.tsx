'use client';

import { useStoriesRankingToggle } from '@/features/stories/model/useStoriesRankingToggle';
import StoriesHeader from '@/features/stories/ui/Header';
import StoriesList from '@/features/stories/ui/List';
import StoriesSearchBar from '@/features/stories/ui/SearchBar';
import StoriesRanking from '@/features/stories/ui/StoriesRanking/Ranking';

const StoriesPageContent = () => {
  const { isRankingOpen, rankingToggle } = useStoriesRankingToggle();

  return (
    <div className="flex flex-col w-full font-sans max-w-7xl">
      <StoriesHeader />

      {/* [Grid Layout] 7:3 비율 고정 */}
      <div className="grid grid-cols-[7fr_3fr] gap-8 mt-8 items-start">
        {/* 1. 검색바 영역: 항상 왼쪽 상단 (7fr) 고정 */}
        <div className="col-span-1">
          <StoriesSearchBar />
        </div>

        {/* 2. 랭킹 영역: 항상 오른쪽 (3fr) */}
        <div
          className={`col-start-2 ${
            isRankingOpen ? 'row-span-2' : 'row-span-1'
          }`}
        >
          {/* isRankingOpen ? 'row-span-2' -> 랭킹이 길어지므로 리스트 옆자리(2행)까지 영역 확보
            !isRankingOpen ? 'row-span-1' -> 닫히면 헤더뿐이므로 1행(검색바 옆)만 차지
          */}
          <div className="sticky top-8 z-10">
            <StoriesRanking
              isRankingOpen={isRankingOpen}
              rankingToggle={rankingToggle}
            />
          </div>
        </div>

        {/* 3. 리스트 영역: 항상 검색바 아래 (2행) */}
        <div
          className={`row-start-2 ${
            isRankingOpen ? 'col-span-1' : 'col-span-2'
          }`}
        >
          {/* isRankingOpen ? 'col-span-1' -> 랭킹이 옆에 있으므로 7fr 너비만 사용
             !isRankingOpen ? 'col-span-2' -> 랭킹이 1행에서 끝났으므로 2행 전체(100%) 사용
          */}
          <StoriesList isExpanded={!isRankingOpen} />
        </div>
      </div>
    </div>
  );
};

export default StoriesPageContent;
