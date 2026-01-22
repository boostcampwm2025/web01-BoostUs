'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Github } from 'lucide-react';

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
    <div className="flex flex-row items-center gap-2 bg-black rounded-lg">
      <button
        className="flex flex-row items-center gap-2 text-white p-2 text-string-16 "
        onClick={() => signIn('github')}
      >
        <Github /> GitHub로 계속하기
      </button>
    </div>
  );
}
