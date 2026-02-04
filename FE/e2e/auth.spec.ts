import { test, expect } from '@playwright/test';

test('GitHub 로그인 버튼 클릭 시 GitHub 인증 페이지로 이동해야 함', async ({
  page,
}) => {
  // 1. 로그인 버튼이 있는 페이지로 이동
  await page.goto('/login');

  // 2. 버튼 찾기: "GitHub로 계속하기"라는 텍스트를 가진 버튼을 찾음
  const loginButton = page.getByRole('button', { name: 'GitHub로 계속하기' });

  // 3. 버튼이 화면에 잘 보이는지 확인 (Smoke Test)
  await expect(loginButton).toBeVisible();

  // 4. 클릭!
  await loginButton.click();

  // 5. GitHub 로그인 페이지로 넘어갔는지 확인
  // (URL에 'github.com'이 포함되어 있으면 성공)
  await page.waitForURL(/github\.com/);
});
