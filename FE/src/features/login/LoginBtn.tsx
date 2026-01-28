'use client';

import { Github } from 'lucide-react';
import { navigateToGithubLogin } from './LoginFetch';
import { useAuth } from '@/features/login/model/auth.store';
import MemberInfoMangeSections from '@/features/myPage/ui/MemberInfoMangeSections';

export default function LoginBtn() {
  const { member, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

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
      <div className="flex flex-col items-center gap-2">
        <MemberInfoMangeSections />
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
          <h3>🔑 Auth 상태 모니터링</h3>
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
        <button
          onClick={handleLogout}
          className="text-string-14 text-neutral-text-weak hover:text-neutral-text-strong"
        >
          로그아웃
        </button>
      </div>
    );
  }

  // 로그인 안 된 상태
  return (
    <div className="flex flex-col items-center gap-2 bg-black rounded-lg">
      <button
        className="flex flex-row items-center gap-2 text-white p-2 text-string-16"
        onClick={navigateToGithubLogin}
      >
        <Github /> GitHub로 계속하기
      </button>
    </div>
  );
}
