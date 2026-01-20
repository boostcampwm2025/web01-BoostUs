'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ModalOverlay({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // 배경 스크롤 차단: 현재 스크롤 위치 저장 후 body를 fixed로 고정
    const scrollY = window.scrollY;

    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      // 배경이 추가로 움직이지 않게 기존 위치 복구
      const top = document.body.style.top;
      const restoreScrollY = top ? Math.abs(parseInt(top, 10)) : scrollY;

      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;

      window.scrollTo(0, restoreScrollY);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => router.back()} // 배경 클릭 시 닫기
      style={{ overscrollBehavior: 'contain' }}
    >
      <div
        className="scrollbar-hide h-full w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
        style={{ overscrollBehavior: 'contain' }}
      >
        {children}
      </div>
    </div>
  );
}
