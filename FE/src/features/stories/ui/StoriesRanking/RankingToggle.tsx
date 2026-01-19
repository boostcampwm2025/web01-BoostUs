'use client';

import { X } from 'lucide-react';

interface StoriesRankingToggleProps {
  isRankingOpen: boolean;
  onRankingToggle: () => void;
}

const StoriesRankingToggle = ({
  onRankingToggle,
}: StoriesRankingToggleProps) => {
  return (
    <button
      onClick={onRankingToggle}
      type="button"
      className="flex cursor-pointer flex-row items-center text-neutral-text-weak hover:text-neutral-text-strong transition-colors duration-150"
    >
      <span className="text-string-16">랭킹 닫기</span>
      <X strokeWidth={1} />
    </button>
  );
};

export default StoriesRankingToggle;
