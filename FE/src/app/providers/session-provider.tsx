'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

type Props = {
  children: React.ReactNode;
};

export const SessionProvider = ({ children }: Props) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
};
