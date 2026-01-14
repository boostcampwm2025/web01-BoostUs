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
    // 스크롤 막기
    document.body.style.overflow = 'hidden';

    // 컴포넌트가 사라질 때 다시 허용
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => router.back()} // 배경 클릭 시 닫기
    >
      <div
        className="scrollbar-hide h-full w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
      >

        {children}
      </div>
    </div>
  );
}
