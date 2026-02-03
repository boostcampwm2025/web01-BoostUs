import { test, expect } from '@playwright/test';

test('마이페이지에서 닉네임 수정(아이콘 버튼) 및 UI 반영 테스트', async ({
  page,
}) => {
  // -------------------------------------------------------
  // 1. [Mocking] 초기 데이터 세팅 (GET)
  // -------------------------------------------------------
  await page.route('*/**/api/members/me/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          member: {
            id: 2,
            nickname: '기존닉네임', // 처음에 화면에 보일 이름
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

  // -------------------------------------------------------
  // 2. [Mocking] 닉네임 수정 요청 가로채기
  // -------------------------------------------------------
  let isPatchCalled = false; // API 호출 여부 체크용 변수

  // updateNickname 함수가 호출하는 API URL 패턴을 잡아냅니다.
  // 보통 /api/members 나 /api/members/nickname 일 것이므로 와일드카드(**) 사용
  await page.route('*/**/api/members/**', async (route) => {
    // GET 요청은 위에서 처리했으니 통과시키고, PATCH(또는 PUT)만 잡습니다.
    if (
      route.request().method() === 'PATCH' ||
      route.request().method() === 'PUT'
    ) {
      isPatchCalled = true;

      const payload = route.request().postDataJSON();
      console.log('API로 전송된 데이터:', payload); // 디버깅용 로그

      // expect(payload.nickname).toBe('새로운닉네임');

      // 백엔드인 척 성공 응답 보내기
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    } else {
      await route.fallback();
    }
  });

  // -------------------------------------------------------
  // 3. 시나리오 실행
  // -------------------------------------------------------

  // (1) 페이지 이동
  await page.goto('/mypage'); // 실제 마이페이지 경로로 수정해주세요

  // (2) "기존닉네임"이 잘 보이는지 확인
  await expect(page.getByText('기존닉네임')).toBeVisible();

  // (3) 수정 버튼 찾기 및 클릭
  // 첫 번째 섹션(프로필 영역)을 먼저 잡습니다. (가장 안전한 기준)
  const profileSection = page.locator('section').first();
  const editButton = profileSection.getByRole('button');

  await editButton.click();

  // (4) 입력창 찾기
  const input = profileSection.getByRole('textbox');

  await expect(input).toBeVisible();

  // (5) 새 닉네임 입력
  await input.fill('새로운닉네임');

  // (6) 저장하기 (엔터키)
  await input.press('Enter');

  // -------------------------------------------------------
  // 4. 최종 검증
  // -------------------------------------------------------

  // (1) 실제 API 요청이 발생했는지 확인
  expect(isPatchCalled).toBe(true);

  // (2) UI가 텍스트 모드로 돌아왔는지 확인 (input이 사라져야 함)
  await expect(input).not.toBeVisible();

  // (3) 화면에 "새로운닉네임"이 표시되는지 확인
  await expect(page.getByText('새로운닉네임')).toBeVisible();
});
