'use client';

import { useAuth } from '@/features/login/model/auth.store';
import { likeStory, unlikeStory } from '@/features/stories/api/stories.api';
import { Heart, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '@/shared/utils/toast';

interface StorySidebarProps {
  storyId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
  onLikeChange?: (isLiked: boolean, likeCount: number) => void;
}

export default function StorySidebar({
  storyId,
  initialIsLiked,
  initialLikeCount,
  onLikeChange,
}: StorySidebarProps) {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  // initialIsLiked와 initialLikeCount가 변경될 때 상태 업데이트
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }, [initialIsLiked, initialLikeCount]);

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      // TODO: 로그인 유도 모달 또는 토스트 메시지
      return;
    }

    if (isLoading) return;

    // 낙관적 업데이트
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    const newIsLiked = !previousIsLiked;
    const newLikeCount = newIsLiked
      ? previousLikeCount + 1
      : Math.max(previousLikeCount - 1, 0);

    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    setIsLoading(true);

    try {
      if (newIsLiked) {
        await likeStory(storyId);
      } else {
        await unlikeStory(storyId);
      }
      onLikeChange?.(newIsLiked, newLikeCount);
    } catch (error) {
      // 실패 시 롤백
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareClick = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      // TODO: 복사 성공 토스트 메시지
    } catch (error) {
      console.error('URL 복사 실패:', error);
      // TODO: 에러 토스트 메시지
    }
  };

  return (
    <aside className="h-fit flex flex-col gap-4 bg-neutral-surface-strong border border-neutral-border-default shadow-default rounded-full p-4">
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleLikeClick}
          disabled={!isAuthenticated || isLoading}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 ${
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
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-neutral-text-default hover:scale-105 transition-all duration-200 cursor-pointer"
          aria-label="공유"
        >
          <Share2 strokeWidth={2} size={24} />
        </button>
      </div>
    </aside>
  );
}
