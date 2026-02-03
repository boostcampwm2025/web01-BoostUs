'use client';

import { useEffect, useState } from 'react';
import { Reaction } from '@/features/questions/model/questions.type';
import { toast } from '@/shared/utils/toast';

interface VoteStats {
  upCount: number;
  downCount: number;
  reaction: Reaction;
}

interface UseOptimisticVoteProps<T extends string | number> {
  id: T;
  upCount: number;
  downCount: number;
  reaction: Reaction;
  api: {
    voteUp: (id: T) => Promise<unknown>;
    voteDown: (id: T) => Promise<unknown>;
  };
}

export const useOptimisticVote = <T extends string | number>({
  id,
  upCount,
  downCount,
  reaction,
  api,
}: UseOptimisticVoteProps<T>) => {
  const [stats, setStats] = useState<VoteStats>({
    upCount,
    downCount,
    reaction,
  });

  // 초기 데이터 동기화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats({ upCount, downCount, reaction });
  }, [upCount, downCount, reaction]);

  const handleVote = async (type: 'LIKE' | 'DISLIKE') => {
    const prevStats = { ...stats };
    const currentReaction = stats.reaction;

    // 새로운 상태 계산 (낙관적 업데이트)
    let nextUpCount = stats.upCount;
    let nextDownCount = stats.downCount;
    let nextReaction: Reaction = type;

    // 이미 같은 타입으로 투표되어 있다면 취소 (Toggle Off)
    if (currentReaction === type) {
      nextReaction = 'NONE';
      if (type === 'LIKE') nextUpCount--;
      if (type === 'DISLIKE') nextDownCount--;
    } else {
      // 새로운 투표 혹은 전환 (Switch)
      if (type === 'LIKE') {
        nextUpCount++;
        if (currentReaction === 'DISLIKE') nextDownCount--; // DISLIKE -> LIKE 전환 시 감소
      } else {
        // type === 'DISLIKE'
        nextDownCount++;
        if (currentReaction === 'LIKE') nextUpCount--; // LIKE -> DISLIKE 전환 시 감소
      }
    }

    setStats({
      upCount: nextUpCount,
      downCount: nextDownCount,
      reaction: nextReaction,
    });

    try {
      if (type === 'LIKE') await api.voteUp(id);
      else await api.voteDown(id);
    } catch (error) {
      setStats(prevStats);
      toast.error(error);
    }
  };

  return { stats, handleVote };
};
