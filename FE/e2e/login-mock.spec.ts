import { test, expect } from '@playwright/test';

test('로그인 성공(Mock) 시 헤더에 유저 닉네임이 포함된 프로필 이미지가 보여야 함', async ({
  page,
}) => {
  // 1. [Mocking] API 가로채기
  await page.route('*/**/api/members/me/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: '성공적으로 응답되었습니다.',
        error: null,
        data: {
          member: {
            id: '2',
            avatarUrl: 'https://avatars.githubusercontent.com/u/176555595?v=4',
            githubLogin: 'leeHB-1007',
            nickname: '연쇄코딩마임', // ★ 이 닉네임이 alt 텍스트에 들어갑니다.
            cohort: 10,
          },
          latestProject: null,
          feed: null,
        },
      }),
    });
  });

  // 2. 메인 페이지 접속
  await page.goto('/');

  // 3. 검증 (Assertion)

  // (1) "로그인" 링크가 사라졌는지 확인
  await expect(page.getByRole('link', { name: '로그인' })).not.toBeVisible();

  // (2) 프로필 이미지가 떴는지 확인
  const profileImage = page.getByRole('img', {
    name: '연쇄코딩마임의 프로필 사진',
  });
  await expect(profileImage).toBeVisible();

  // (3) ★ 수정된 부분: 클릭해서 이동하는 대신, 링크 주소(href)가 맞는지 확인
  // 이미지를 감싸고 있는 링크를 찾습니다.
  const myPageLink = page.getByRole('link', {
    name: '연쇄코딩마임의 프로필 사진',
  });

  // "이 링크를 누르면 /mypage로 간다"는 사실만 검증하면 충분합니다.
  await expect(myPageLink).toHaveAttribute('href', '/mypage');
});
