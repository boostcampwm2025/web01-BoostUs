import type { Metadata } from 'next';
import LoginContainer from '@/widgets/Login/Login.container';
import { Suspense } from 'react'; // 분리한 클라이언트 컴포넌트

export const metadata: Metadata = {
  title: '로그인 - BoostUs',
  description: '로그인하고 서비스를 이용해보세요.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContainer />
    </Suspense>
  );
}
