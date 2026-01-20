'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();
  const handleGoBack = (): void => {
    router.back();
  };

  return (
    <button
      onClick={handleGoBack}
      className="flex flex-row items-center justify-center cursor-pointer transition-colors duration-150 text-neutral-text-default hover:text-neutral-text-strong"
    >
      <ChevronLeft size={24} strokeWidth={1} />
      <span className="text-string-16">목록으로 돌아가기</span>
    </button>
  );
};

export default BackButton;
