'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface VoteStats {
  upCount: number;
  downCount: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface UseOptimisticVoteProps<T extends string | number> {
  id: T;
  initialStats: VoteStats;
  api: {
    voteUp: (id: T) => Promise<unknown>;
    voteDown: (id: T) => Promise<unknown>;
  };
}

export const useOptimisticVote = <T extends string | number>({
  id,
  initialStats,
  api,
}: UseOptimisticVoteProps<T>) => {
  const router = useRouter();
  const [stats, setStats] = useState(initialStats);
  const [myVote, setMyVote] = useState<'up' | 'down' | null>(null);

  // 초기 데이터 동기화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(initialStats);
    if (initialStats.isLiked) setMyVote('up');
    else if (initialStats.isDisliked) setMyVote('down');
    else setMyVote(null);
  }, [initialStats]);

  const handleVote = async (type: 'up' | 'down') => {
    const prevStats = { ...stats };
    const prevVote = myVote;

    // 1. 새로운 상태 계산 (낙관적 업데이트)
    let nextUpCount = stats.upCount;
    let nextDownCount = stats.downCount;
    let nextVote: 'up' | 'down' | null = type;

    if (myVote === type) {
      // 이미 투표한 버튼을 다시 클릭 -> 취소
      nextVote = null;
      if (type === 'up') nextUpCount--;
      else nextDownCount--;
    } else {
      // 새로운 투표 혹은 전환
      if (type === 'up') {
        nextUpCount++;
        if (myVote === 'down') nextDownCount--; // down -> up 전환
      } else {
        nextDownCount++;
        if (myVote === 'up') nextUpCount--; // up -> down 전환
      }
    }

    setStats({ ...stats, upCount: nextUpCount, downCount: nextDownCount });
    setMyVote(nextVote);

    try {
      // API 호출 (백엔드 API가 토글 방식으로 작동한다고 가정)
      if (type === 'up') await api.voteUp(id);
      else await api.voteDown(id);

      router.refresh();
    } catch (error) {
      console.error(`Error ${type}voting:`, error);
      setStats(prevStats);
      setMyVote(prevVote);
      alert('투표 처리에 실패했습니다.');
    }
  };

  return { stats, myVote, handleVote };
};
