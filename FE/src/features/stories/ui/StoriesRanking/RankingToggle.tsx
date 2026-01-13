'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';

interface StoriesRankingToggleProps {
  isRankingOpen: boolean;
  onRankingToggle: () => void;
}

const StoriesRankingToggle = ({
  isRankingOpen,
  onRankingToggle,
}: StoriesRankingToggleProps) => {
  return (
    <button
      onClick={onRankingToggle}
      type="button"
      className="flex flex-row items-center cursor-pointer"
    >
      {isRankingOpen ? (
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
