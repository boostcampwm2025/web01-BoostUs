'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useStoriesRankingToggle } from '../../model/useStoriesRankingToggle';

const StoriesRankingToggle = () => {
  const { isOpen, rankingToggle } = useStoriesRankingToggle();

  return (
    <button
      onClick={rankingToggle}
      type="button"
      className="flex flex-row items-center cursor-pointer"
    >
      {isOpen ? (
        <>
          <span className="text-neutral-text-strong text-string-16">
            랭킹 닫기
          </span>
          <ChevronUp
            className="text-neutral-text-strong"
            strokeWidth={1}
            size={24}
          />
        </>
      ) : (
        <>
          <span className="text-neutral-text-strong text-string-16">
            랭킹 열기
          </span>
          <ChevronDown
            className="text-neutral-text-strong"
            strokeWidth={1}
            size={24}
          />
        </>
      )}
    </button>
  );
};

export default StoriesRankingToggle;
