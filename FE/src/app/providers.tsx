'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime: 데이터가 '상한(stale)' 상태로 간주되기 전까지의 시간 (5분)
            // 이 시간 동안은 다시 fetch하지 않고 캐시된 데이터를 보여줍니다.
            staleTime: 60 * 1000 * 5,

            // gcTime: 언마운트된 데이터가 메모리에 남아있는 시간 (5분)
            gcTime: 5 * 60 * 1000,

            // retry: API 실패 시 재시도 횟수 (1번만 더 시도)
            retry: 1,

            // 창이 다시 포커스되었을 때 자동 갱신 여부 (개발 중엔 false가 편할 수 있음)
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발자 도구 (프로덕션 배포 시 자동으로 제외됨) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

Providers.propTypes = {};

export default Providers;
