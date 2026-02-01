'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/shared/ui/Button/Button';

const BackButton = ({ url }: { url: string }) => {
  const router = useRouter();
  const handleGoBack = (): void => {
    router.push(url);
  };

  return (
    <Button onClick={handleGoBack} buttonStyle="text">
      <ChevronLeft size={24} strokeWidth={1} className="-ml-1 -mr-1" />
      <span className="text-string-16">목록으로 돌아가기</span>
    </Button>
  );
};

export default BackButton;
