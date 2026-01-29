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

  // 현재 보여지는 카운트 상태
  const [stats, setStats] = useState(initialStats);

  // 내 투표 상태 ('up' | 'down' | null)
  // 초기 데이터에 isLiked/isDisliked가 없다면 null로 시작
  const [myVote, setMyVote] = useState<'up' | 'down' | null>(() => {
    if (initialStats.isLiked) return 'up';
    if (initialStats.isDisliked) return 'down';
    return null;
  });

  // 부모 컴포넌트에서 데이터가 갱신되면 로컬 상태 동기화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(initialStats);
    if (initialStats.isLiked) setMyVote('up');
    else if (initialStats.isDisliked) setMyVote('down');
    else setMyVote(null);
  }, [initialStats]);

  const handleVote = async (type: 'up' | 'down') => {
    // 1. 이전 상태 저장 (롤백용)
    const prevStats = { ...stats };
    const prevVote = myVote;

    // 2. 낙관적 업데이트 (Optimistic Update)
    // 단순히 카운트를 1 올리는 로직 유지 (토글 로직이 필요하다면 여기에 추가)
    setStats((prev) => ({
      ...prev,
      upCount: type === 'up' ? prev.upCount + 1 : prev.upCount,
      downCount: type === 'down' ? prev.downCount + 1 : prev.downCount,
    }));
    setMyVote(type);

    try {
      // 3. API 호출
      if (type === 'up') {
        await api.voteUp(id);
      } else {
        await api.voteDown(id);
      }

      // 4. 서버 데이터 갱신 요청
      router.refresh();
    } catch (error) {
      console.error(`Error ${type}voting:`, error);
      // 5. 실패 시 롤백
      setStats(prevStats);
      setMyVote(prevVote);
      alert('투표 처리에 실패했습니다.');
    }
  };

  return {
    stats,
    myVote,
    handleVote,
  };
};
