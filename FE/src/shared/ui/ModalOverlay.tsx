'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { X } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 "
      onClick={() => router.back()} // 배경 클릭 시 닫기
    >
      <div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl h-full overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">프로젝트 상세</h2>
          <button
            onClick={() => router.back()}
            className="px-3 py-1  rounded hover:bg-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
