'use client';

import { useEffect } from 'react';
import Button from '@/shared/ui/Button/Button';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // 에러 로깅 서비스(Sentry 등)가 있다면 여기서 전송
    console.error('Global Error caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-center">
      <h2 className="text-display-24 text-neutral-text-strong">
        일시적인 오류가 발생했습니다.
      </h2>
      <p className="text-neutral-text-default text-body-16 mb-4">
        {getErrorMessage(error)}
      </p>
      <div className="flex gap-2">
        <Button onClick={() => reset()} buttonStyle="outlined">
          다시 시도
        </Button>
        <Button
          onClick={() => (window.location.href = '/')}
          buttonStyle="primary"
        >
          홈으로 이동
        </Button>
      </div>
    </div>
  );
};

export default Error;
