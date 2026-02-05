'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/login/model/auth.store';
import MyPage from './MyPage';

export default function MyPageContainer() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>로딩 중...</div>; // TODO: 스켈레톤
  if (!isAuthenticated) return null;

  return <MyPage />;
}
