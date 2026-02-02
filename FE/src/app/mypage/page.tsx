import type { Metadata } from 'next';
import MyPageContainer from '@/widgets/MyPage/MyPage.container';

export const metadata: Metadata = {
  title: '마이페이지 - BoostUs',
  description: '내 활동 내역을 확인하세요.',
};

export default function MyPagePage() {
  return <MyPageContainer />;
}
