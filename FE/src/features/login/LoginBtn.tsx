'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginBtn() {
  const { data: session } = useSession();

  // 로그인 된 상태
  if (session) {
    return (
      <div>
        <p>{session.user?.name}님 반갑소!</p>
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    );
  }

  // 로그인 안 된 상태
  return (
    <button onClick={() => signIn('github')}>
      GitHub 로그인 (Repo 권한 포함)
    </button>
  );
}
