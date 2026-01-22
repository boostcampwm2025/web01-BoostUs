'use client';

import { Github } from 'lucide-react';
import { navigateToGithubLogin } from './LoginFetch'; // 위에서 만든 파일 import
import { useState, useEffect } from 'react';

export default function LoginBtn() {
  // 아직 전역 상태 관리가 없으니 일단 로컬 state로 둡니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // TODO: 페이지 로드 시 로그인 여부 체크하는 로직
  // useEffect(() => {
  //   const token = localStorage.getItem('accessToken');
  //   if (token) {
  //     setIsLoggedIn(true);
  //     // 사용자 정보 가져오는 API 호출 필요
  //   }
  // }, []);

  const handleLogout = () => {
    // 로그아웃 로직 (토큰 삭제 등)
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.');
  };

  // 로그인 된 상태 (임시)
  if (isLoggedIn) {
    return (
      <div>
        <p>{userName || '사용자'}님 반갑소!</p>
        <button onClick={handleLogout}>로그아웃</button>
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
