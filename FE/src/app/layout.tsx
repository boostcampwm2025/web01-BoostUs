import { AuthInitializer } from '@/features/login/AuthInitializer';
import Footer from '@/widgets/Footer';
import Header from '@/widgets/Header';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'BoostUs - 부스트캠퍼들이 함께 기록하고, 함께 성장하는 커뮤니티 🌱',
  description: '',
};

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pretendard.variable}>
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <AuthInitializer />
        <Header />
        <main className="bg-neutral-surface-default flex w-full flex-1 flex-col items-center px-4 py-32">
          {children}
          <Script
            src="https://kr.object.ncloudstorage.com/boostad-sdk-dev/sdk/sdk.js"
            strategy="afterInteractive" // 페이지 로드 후 실행 (성능 최적화)
            data-blog-key="d88f304b-6eae-4010-9f1a-2c5963085a9b"
            data-context="개발"
            data-auto="false" // 수동 모드 설정 (필수)
            async // 가이드에 있는 async 속성
          />
          <Script
            src="https://utmate.me/sdk/utmate-sdk.iife.js" // web16팀 utmate sdk (사용성 테스트)
            strategy="afterInteractive"
            async
          />
        </main>
        <Footer />
      </body>
    </html>
  );
}
