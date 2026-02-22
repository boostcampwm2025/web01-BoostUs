'use client'; // 클라이언트 기능 사용 선언

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Github } from 'lucide-react';
import { navigateToGithubLogin } from '@/features/login/LoginFetch';
import { useAuth } from '@/features/login/model/auth.store';
import PageHeader from '@/shared/ui/PageHeader';

export default function LoginContainer() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // redirect 파라미터가 있으면 해당 경로로, 없으면 mypage로
      router.replace(redirect ?? '/mypage');
    }
  }, [isAuthenticated, isLoading, router, redirect]);

  if (isLoading || isAuthenticated) return null;

  return (
    <div className="w-full max-w-270 mx-auto">
      <PageHeader title="로그인" subtitle="BoostUs에 어서오세요!" />
      <div className="flex flex-col items-center w-full mt-20">
        <button
          type="button"
          className="flex flex-row items-center gap-2 text-brand-text-on-default cursor-pointer bg-brand-surface-github rounded-lg px-4 py-2 text-string-16"
          onClick={() => {
            navigateToGithubLogin(redirect ?? undefined);
          }}
        >
          <Github /> GitHub로 계속하기
        </button>
      </div>
    </div>
  );
}
