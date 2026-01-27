export const getClientMemberId = (): string | null => {
  if (typeof window === 'undefined') return null;

  // 1) localStorage
  const ls = window.localStorage.getItem('memberId');
  if (ls) return ls;

  // 2) cookie (memberId=123)
  const match = document.cookie.match(/(?:^|; )memberId=([^;]+)/);
  if (match?.[1]) return decodeURIComponent(match[1]);

  return null;
};
