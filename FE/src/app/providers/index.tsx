'use client';

import { SessionProvider } from './session-provider';
// 적용될 프로바이더 추가

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {/* <ThemeProvider> 나중에 이렇게 감싸면 됨 */}
      {children}
      {/* </ThemeProvider> */}
    </SessionProvider>
  );
};
