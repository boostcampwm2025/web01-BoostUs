'use client';

import Button from '@/shared/ui/Button/Button';

const GlobalError = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-display-24 text-neutral-text-strong">
            치명적인 오류가 발생했습니다.
          </h2>
          <Button onClick={() => reset()}>새로고침</Button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
