'use client';

import { Heart, Share2 } from 'lucide-react';
import { toast } from '@/shared/utils/toast';
import { useState } from 'react'; // ✅ useState 추가

interface StorySidebarProps {
  isLiked: boolean;
  likeCount: number;
  onLikeClick: () => void;
  isAuthenticated: boolean;
}

export default function StorySidebar({
  isLiked,
  likeCount,
  onLikeClick,
  isAuthenticated,
}: StorySidebarProps) {
  const [isShared, setIsShared] = useState(false);

  const handleShareClick = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success('URL이 클립보드에 복사되었습니다.');

      // ✅ 좋아요 버튼처럼 색상 변경 (토글 효과)
      setIsShared(true);
      setTimeout(() => setIsShared(false), 1000);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <aside className="h-fit flex flex-col items-center justify-center gap-4 bg-neutral-surface-strong border border-neutral-border-default shadow-default rounded-full px-2 py-2">
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onLikeClick}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 ${
            isLiked
              ? 'bg-brand-surface-default text-brand-text-on-default'
              : 'bg-neutral-surface-bold text-neutral-text-default'
          } ${
            !isAuthenticated
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:scale-105'
          }`}
          aria-label={isLiked ? '좋아요 취소' : '좋아요'}
        >
          <Heart
            className={isLiked ? 'fill-current' : ''}
            strokeWidth={2}
            size={24}
          />
        </button>
        <span className="text-display-16 text-neutral-text-default">
          {likeCount}
        </span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleShareClick}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer hover:scale-105 ${
            isShared
              ? 'bg-brand-surface-default text-brand-text-on-default'
              : 'bg-neutral-surface-bold text-neutral-text-default'
          }`}
          aria-label="공유"
        >
          <Share2 strokeWidth={2} size={24} />
        </button>
      </div>
    </aside>
  );
}
