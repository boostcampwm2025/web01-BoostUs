'use client';

import StoriesCard from '@/features/stories/ui/Card';
import StoriesListDropdown from '@/features/stories/ui/ListDropdown/Dropdown';
import { useStoriesContext } from '@/features/stories/model';
import { useMemo } from 'react';
import { Story } from '@/features/stories/model/stories.type';

interface StoriesListProps {
  initialStories: Story[];
}

const StoriesList = ({ initialStories }: StoriesListProps) => {
  const { isRankingOpen, searchQuery, sortOption } = useStoriesContext();

  const filteredAndSortedStories = useMemo(() => {
    // TODO: API 연결할 때 대응 필요
    let result = [...initialStories];

    // 검색어 필터링
    if (searchQuery) {
      result = result.filter((story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬
    // TODO: 다른 정렬 옵션도 구현 필요
    if (sortOption === 'latest') {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [initialStories, searchQuery, sortOption]);

  return (
    <section className="flex w-full flex-col items-end gap-4">
      <StoriesListDropdown />
      <div
        className={`grid w-full ${!isRankingOpen ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}
      >
        {filteredAndSortedStories.length > 0 ? (
          filteredAndSortedStories.map((story) => (
            <StoriesCard key={story.id} story={story} />
          ))
        ) : (
          <div className="text-neutral-text-weak col-span-full py-10 text-center">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};

export default StoriesList;
