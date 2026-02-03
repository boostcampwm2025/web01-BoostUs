'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/login/model/auth.store';
import MyPage from './MyPage';

export default function MyPageContainer() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 로딩 끝났고, 로그인 안 되어 있으면 -> 로그인 페이지로 쫓아냄
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중이거나, 로그인 안 된 상태면 아무것도 안 보여줌
  if (isLoading) return <div>로딩 중...</div>;
  if (!isAuthenticated) return null;

  // 통과했으면 실제 화면을 보여줌
  return <MyPage />;
}
