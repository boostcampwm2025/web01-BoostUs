import { AuthInitializer } from '@/features/login/AuthInitializer';
import Footer from '@/widgets/Footer';
import Header from '@/widgets/Header/Header';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import Providers from '@/app/providers';
import { getMeAction } from '@/shared/actions/auth';

export const metadata: Metadata = {
  title: 'boostus - 부스트캠퍼들이 함께 기록하고, 함께 성장하는 커뮤니티 🌱',
  description: '',
};

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const user = await getMeAction();
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <Providers>
          {/*<AuthInitializer user={user}>*/}
          <Header />
          <main className="bg-neutral-surface-default flex w-full flex-1 flex-col items-center px-4 py-32">
            {children}
            <Script
              src="https://kr.object.ncloudstorage.com/boostad-sdk-dev/sdk/sdk.js"
              strategy="afterInteractive"
              data-blog-key="d88f304b-6eae-4010-9f1a-2c5963085a9b"
              data-context="개발"
              data-auto="false"
              async
            />
            <Script
              src="https://utmate.me/sdk/utmate-sdk.iife.js"
              strategy="lazyOnload"
              async
            />
          </main>
          <Toaster />
          <Footer />
          {/*</AuthInitializer>*/}
        </Providers>
      </body>
    </html>
  );
}
