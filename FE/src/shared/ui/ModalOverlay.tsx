'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CloseIcon from '@/components/ui/CloseIcon';

interface ModalOverlayProps {
  children: React.ReactNode;
  /** 배경 클릭 시 모달 닫힘 여부 */
  closeOnOutsideClick?: boolean;
}

export default function ModalOverlay({
  children,
  closeOnOutsideClick = false, // 기본값은 닫히지 않음 (register, edit용)
}: ModalOverlayProps) {
  const router = useRouter();

  useEffect(() => {
    // 배경 스크롤 차단 로직 (기존과 동일)
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
      const top = document.body.style.top;
      const restoreScrollY = top ? Math.abs(parseInt(top, 10)) : scrollY;
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, restoreScrollY);
    };
  }, []);

  const handleBackgroundClick = () => {
    if (closeOnOutsideClick) {
      router.back();
    }
  };

  return (
    // 1. 배경
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-10" // 모바일 대응을 위해 padding 조정
      style={{ overscrollBehavior: 'contain' }}
      onClick={handleBackgroundClick}
    >
      {/* 2. 모달 컨테이너 */}
      <div
        className="relative h-full w-full max-w-5xl overflow-hidden rounded-2xl bg-neutral-surface-default shadow-lg"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 이벤트 전파 방지
      >
        {/* 3. 고정된 닫기 버튼 */}
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none"
          aria-label="닫기"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        {/* 4. 스크롤 가능 콘텐츠 영역*/}
        <div
          className="scrollbar-hide h-full w-full overflow-y-auto p-8 pt-16" // pt-16은 버튼과 내용 겹침 방지용 상단 패딩
          style={{ overscrollBehavior: 'contain' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
