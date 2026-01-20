'use client';

import StoriesCard from '@/features/stories/ui/Card/Card';
import { useStoriesContext } from '@/features/stories/model';
import { useMemo } from 'react';
import { Story } from '@/features/stories/model/stories.type';

interface StoriesListProps {
  initialStories: Story[];
}

const StoriesList = ({ initialStories }: StoriesListProps) => {
  const { isRankingOpen, searchQuery } = useStoriesContext();

  const filteredAndSortedStories = useMemo(() => {
    // TODO: API 연결할 때 대응 필요
    let result = [...initialStories];

    // 검색어 필터링
    if (searchQuery) {
      result = result.filter((story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [initialStories, searchQuery]);

  return (
    <section className="flex w-full flex-col items-end gap-4">
      <div
        className={`grid w-full ${!isRankingOpen ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}
      >
        {filteredAndSortedStories.length > 0 ? (
          filteredAndSortedStories.map((story) => (
            <StoriesCard id={story.id} key={story.id} story={story} />
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
