import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.boostus.app',
  appName: 'BoostUs',
  // Next.js SSR 앱은 정적 index.html 산출물이 없어, 최소 셸 폴더를 webDir로 둡니다.
  webDir: 'capacitor-shell',
  ios: {
    contentInset: 'always',
  },
  server: {
    // 실기기 테스트 시 CAP_SERVER_URL=http://<PC_LAN_IP>:5173 로 실행하세요.
    url: process.env.CAP_SERVER_URL ?? 'http://localhost:5173',
    cleartext: true,
    // OAuth(깃허브) 왕복 과정이 Safari로 빠지지 않도록 WebView 내 네비게이션 허용 도메인을 명시합니다.
    allowNavigation: ['localhost', '127.0.0.1', 'github.com', '*.github.com'],
  },
};

export default config;
