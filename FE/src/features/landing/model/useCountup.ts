import { useEffect, useState } from 'react';

export const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

// 2. 커스텀 훅
export const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      startTime ??= timestamp;
      const progress = timestamp - startTime;

      const relativeProgress = Math.min(progress / duration, 1);

      const currentCount = Math.round(end * easeOutExpo(relativeProgress));

      setCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return count;
};
