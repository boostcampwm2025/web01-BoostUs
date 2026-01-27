import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';

export const useRankingButtonVisibility = (isRankingOpen: boolean): boolean => {
  const { scrollY } = useScroll();
  const [isHidden, setIsHidden] = useState(false);

  // 렌더링을 유발하지 않고 이전 스크롤 위치만 기억하기 위해 useRef 사용
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastYRef.current;

    // 현재 위치 업데이트 (로직 수행 후가 아니라 전에 업데이트해도 무방하나, 비교를 위해 변수 할당 후 갱신)
    lastYRef.current = latest;

    // 1. 랭킹 패널이 열려있으면 버튼을 숨기지 않음
    if (isRankingOpen) {
      setIsHidden(false);
      return;
    }

    // 2. 스크롤을 내리는 중이고(latest > previous), 일정 깊이(100px) 이상 내려갔을 때 -> 숨김
    if (latest > previous && latest > 100) {
      setIsHidden(true);
    }
    // 3. 스크롤을 올리는 중 -> 보임
    else if (latest < previous) {
      setIsHidden(false);
    }
  });

  return isHidden;
};

export default useRankingButtonVisibility;
