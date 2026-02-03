export const navigateToGithubLogin = (redirectPath?: string) => {
  window.location.href = redirectPath
    ? `/api/auth/login?redirect=${encodeURIComponent(redirectPath)}`
    : '/api/auth/login';
};
