'use client';

import { Github } from 'lucide-react';
import { navigateToGithubLogin } from './LoginFetch';
import { useAuth } from '@/features/login/model/auth.store';
import MemberInfoMangeSections from '@/features/myPage/ui/MemberInfoMangeSections';
import ActivityGraph from '@/features/myPage/ui/ActivityGraph';
import MyBadge from '@/features/myPage/ui/MyBadge';
import MyViews from '@/features/myPage/ui/MyViews';
import PageHeader from '@/shared/ui/PageHeader';

export default function LoginBtn() {
  const { member, isAuthenticated, isLoading } = useAuth();

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 bg-black rounded-lg">
        <div className="text-white p-2 text-string-16">로딩 중...</div>
      </div>
    );
  }

  // 로그인 된 상태
  if (isAuthenticated && member) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-95 flex flex-col gap-6 shrink-0">
          <MemberInfoMangeSections />
          <MyBadge />
        </div>

        <div className="w-full flex-1 flex flex-col gap-6">
          <ActivityGraph />
          <MyViews />
        </div>

        {/* 아래 member 보여주기 */}
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '12px',
            zIndex: 9999,
          }}
        >
          <h3>🔑 Auth 상태 모니터링 dd</h3>
          <p>
            <strong>로딩 중:</strong> {isLoading ? 'YES' : 'NO'}
          </p>
          <p>
            <strong>로그인 여부:</strong> {isAuthenticated ? 'YES' : 'NO'}
          </p>
          <p>
            <strong>유저 정보:</strong>
          </p>
          <pre>{JSON.stringify(member, null, 2)}</pre>
        </div>
      </div>
    );
  }

  // 로그인 안 된 상태
  return (
    <div className="w-full max-w-270">
      <PageHeader title="로그인" subtitle="BoostUs에 어서오세요!" />
      <div className="flex flex-col items-center w-full mt-20">
        <button
          type="button"
          className="flex flex-row items-center gap-2 text-brand-text-on-default cursor-pointer bg-brand-surface-github rounded-lg px-4 py-2 text-string-16"
          onClick={navigateToGithubLogin}
        >
          <Github /> GitHub로 계속하기
        </button>
      </div>
    </div>
  );
}
