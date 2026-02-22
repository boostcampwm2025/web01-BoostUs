import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.boostus.app',
  appName: 'BoostUs',
  // Next.js SSR 앱은 정적 index.html 산출물이 없어, 최소 셸 폴더를 webDir로 둡니다.
  webDir: 'capacitor-shell',
  server: {
    // 실기기 테스트 시 CAP_SERVER_URL=http://<PC_LAN_IP>:5173 로 실행하세요.
    url: process.env.CAP_SERVER_URL ?? 'http://localhost:5173',
    cleartext: true,
  },
};

export default config;
