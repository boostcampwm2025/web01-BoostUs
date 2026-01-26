'use client';

import { Github } from 'lucide-react';
import { navigateToGithubLogin } from './LoginFetch';
import { useAuth } from './model/auth.context';

export default function LoginBtn() {
  const { member, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
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
        <p className="text-string-16">{member.nickname || '사용자'}님 반갑소!</p>
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
