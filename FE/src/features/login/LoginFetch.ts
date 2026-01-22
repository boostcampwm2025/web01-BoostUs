// loginfetch.ts
export const navigateToGithubLogin = () => {
  // const res = fetch('/api/github/login');
  // // if (!res.ok) throw new Error('로그인 요청 실패');
  // console.log('로그인 요청', res);
  // return res;
  window.location.href = '/api/auth/login';
};
