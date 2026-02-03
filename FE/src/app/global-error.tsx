'use client';

import Button from '@/shared/ui/Button/Button';
import { useEffect } from 'react';

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error('Global Error caught:', error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-display-24 text-neutral-text-strong">
            치명적인 오류가 발생했습니다.
          </h2>
          <p className="text-neutral-text-default text-body-16 mb-4">
            {error.message || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <Button onClick={() => reset()}>새로고침</Button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
