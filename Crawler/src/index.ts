import dotenv from 'dotenv';
import { Scheduler } from './scheduler';

// 환경 변수 로드
dotenv.config();

/**
 * 메인 함수
 */
async function main() {
  console.log('\n========================================');
  console.log('🎯 BoostUs RSS Crawler');
  console.log('========================================');

  try {
    // 환경 변수 로드
    const config = {
      BE_API_URL: process.env.BE_API_URL ?? 'http://localhost:3000',
      CRON_SCHEDULE: process.env.CRON_SCHEDULE ?? '0 * * * *',
      NODE_ENV: process.env.NODE_ENV,
    };

    // 스케줄러 생성 및 시작
    const scheduler = new Scheduler(config.BE_API_URL, config.CRON_SCHEDULE);
    scheduler.start();

    // Graceful shutdown 처리
    process.on('SIGINT', () => {
      console.log('\n\n📛 Received SIGINT signal');
      scheduler.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n\n📛 Received SIGTERM signal');
      scheduler.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// 프로그램 시작
main();
