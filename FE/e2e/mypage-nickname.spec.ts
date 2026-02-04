import { test, expect } from '@playwright/test';

test('마이페이지에서 닉네임 수정(아이콘 버튼) 및 UI 반영 테스트', async ({
  page,
}) => {
  // 1. [Mocking] 초기 데이터 세팅 (GET)
  await page.route('*/**/api/members/me/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          member: {
            id: 2,
            nickname: '기존닉네임',
            avatarUrl: null,
            githubLogin: 'test-user',
            cohort: 10,
          },
          latestProject: null,
          feed: null,
        },
      }),
    });
  });

  // 2. [Mocking] 수정 요청에 대한 '응답'만 설정
  await page.route('*/**/api/members/**', async (route) => {
    if (
      route.request().method() === 'PATCH' ||
      route.request().method() === 'PUT'
    ) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    } else {
      await route.fallback();
    }
  });

  // 3. 시나리오 실행
  await page.goto('/mypage');

  const profileSection = page.locator('section').first();
  const editButton = profileSection.getByRole('button');
  await editButton.click();

  const input = profileSection.getByRole('textbox');
  await input.fill('새로운닉네임');

  const [request] = await Promise.all([
    page.waitForRequest(
      (request) =>
        request.url().includes('/api/members') &&
        (request.method() === 'PATCH' || request.method() === 'PUT')
    ),
    input.press('Enter'),
  ]);

  // 4. 최종 검증

  // (1) 요청 데이터 검증 (isPatchCalled 변수 대신 request 객체 직접 확인)
  // request가 잡혔다는 것 자체가 요청이 발생했다는 뜻이므로 true/false 체크 불필요
  const postData = request.postDataJSON();
  expect(postData.nickname).toBe('새로운닉네임'); // Payload까지 확실하게 검증 가능

  // (2) UI가 텍스트 모드로 돌아왔는지 확인
  await expect(input).not.toBeVisible();

  // (3) 화면에 "새로운닉네임"이 표시되는지 확인
  await expect(page.getByText('새로운닉네임')).toBeVisible();
});
