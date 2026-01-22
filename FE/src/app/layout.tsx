import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import { Providers } from '@/app/providers';

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
        <Providers>
          <Header />
          <main className="bg-neutral-surface-default flex w-full flex-1 flex-col items-center px-4 py-32">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
