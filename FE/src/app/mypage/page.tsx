import type { Metadata } from 'next';
import MyPageContainer from '@/widgets/MyPage/MyPage.container';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'boostus - 마이페이지',
  description: '내 활동 내역을 확인하세요.',
};

export default async function MyPagePage() {
  const cookieStore = await cookies();
  const hasToken = cookieStore.has('accessToken'); // 혹은 사용하는 쿠키 이름 (예: 'connect.sid', 'token' 등)

  // 🚨 [서버 리다이렉트] 토큰이 없으면 아예 렌더링 시작도 안 하고 튕겨냄
  if (!hasToken) {
    redirect('/login?redirect=/mypage');
  }

  return <MyPageContainer />;
}
