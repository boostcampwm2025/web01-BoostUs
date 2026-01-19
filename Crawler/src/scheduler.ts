import cron from 'node-cron';
import { FeedManager } from './feed-manager';

/**
 * Scheduler
 * Cron을 사용하여 주기적으로 피드를 수집합니다.
 */
export class Scheduler {
  private cronJob: cron.ScheduledTask | null = null;
  private feedManager: FeedManager;
  private schedule: string;

  constructor(beApiUrl: string, cronSchedule: string) {
    this.feedManager = new FeedManager(beApiUrl);
    this.schedule = cronSchedule;
  }

  /**
   * 스케줄러 시작
   */
  start(): void {
    // Cron 표현식 검증
    if (!cron.validate(this.schedule)) {
      throw new Error(`Invalid cron schedule: ${this.schedule}`);
    }

    console.log(`\n⏰ Starting scheduler with cron: ${this.schedule}`);
    console.log('   (Use Ctrl+C to stop)\n');

    // Cron Job 생성 및 시작
    this.cronJob = cron.schedule(this.schedule, async () => {
      const now = new Date().toISOString();
      console.log(`\n⏰ [${now}] Cron job triggered`);

      try {
        await this.feedManager.collectAllFeeds();
      } catch (error) {
        console.error('❌ Error during scheduled feed collection:', error);
      }
    });

    console.log('✅ Scheduler started successfully');

    // 즉시 한 번 실행 (선택사항)
    this.runImmediately();
  }

  /**
   * 스케줄러 중지
   */
  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('\n⏸️  Scheduler stopped');
    }
  }

  /**
   * 즉시 피드 수집 실행
   */
  async runImmediately(): Promise<void> {
    console.log('\n🚀 Running feed collection immediately...');
    try {
      await this.feedManager.collectAllFeeds();
    } catch (error) {
      console.error('❌ Error during immediate feed collection:', error);
    }
  }
}
