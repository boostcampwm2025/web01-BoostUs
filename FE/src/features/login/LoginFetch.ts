import { Capacitor } from '@capacitor/core';

export const navigateToGithubLogin = (redirectPath?: string) => {
  const params = new URLSearchParams();
  const safeRedirect = redirectPath?.startsWith('/') ? redirectPath : '/';
  params.set('redirect', safeRedirect);

  if (Capacitor.isNativePlatform()) {
    const loginUrl = `${window.location.origin}/api/auth/login?${params.toString()}`;
    // 앱 WebView에서 웹 OAuth 플로우를 그대로 진행합니다.
    window.location.href = loginUrl;
    return;
  }

  window.location.href = `/api/auth/login?${params.toString()}`;
};
