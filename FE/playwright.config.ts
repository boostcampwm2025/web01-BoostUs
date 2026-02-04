import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    // ★ 수정 1: 프론트엔드 포트인 5173으로 변경
    // 이제 page.goto('/') 하면 http://localhost:5173/ 으로 이동합니다.
    baseURL: 'http://localhost:5173',

    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // 필요시 주석 해제
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // ★ 수정 2: 웹서버 설정 변경
  webServer: {
    // 테스트 실행 시 도커가 꺼져있으면 이 명령어로 켭니다.
    command: 'docker compose up',

    // Playwright가 "서버 켜졌나?" 하고 찔러보는 주소 (프론트엔드 포트)
    url: 'http://localhost:5173',

    // 이미 도커가 켜져 있으면(개발 중이면) 재사용합니다. (필수!)
    reuseExistingServer: true,

    timeout: 120 * 1000,
  },
});
