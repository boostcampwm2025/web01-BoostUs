import QnAHeader from '@/features/qna/ui/QnAHeader';

export default function QnALayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* 클라이언트 컴포넌트 (헤더 + 필터) */}
      <QnAHeader />

      {/* 페이지 콘텐츠 (리스트 등) */}
      <main>{children}</main>
    </div>
  );
}
