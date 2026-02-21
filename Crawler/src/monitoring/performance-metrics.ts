import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import {
  PerformanceReport,
  FeedMetrics,
  ErrorBreakdown,
  DbWriteBreakdown,
  StoryCreationResult,
  ErrorType,
} from '../types';

/**
 * Performance Metrics Collector
 * RSS 크롤러의 성능 지표를 수집하고 JSON 리포트를 생성합니다.
 */
export class PerformanceMetrics {
  private startTime: number;
  private currentFeed: Partial<FeedMetrics> | null = null;
  private feedMetrics: FeedMetrics[] = [];
  private errorBreakdown: ErrorBreakdown = {
    timeout: 0,
    parse_error: 0,
    http_error: 0,
    network_error: 0,
    unknown: 0,
  };
  private dbWriteBreakdown: DbWriteBreakdown = {
    insert: 0,
    update: 0,
    skip: 0,
  };

  private downloadTimes: number[] = [];
  private parseTimes: number[] = [];
  private createTimes: number[] = [];

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * 피드 처리 시작
   */
  startFeed(feedUrl: string): void {
    this.currentFeed = {
      feed_url: feedUrl,
      download_time_s: 0,
      parse_time_s: 0,
      create_time_s: 0,
      stories_created: 0,
      stories_failed: 0,
    };
  }

  /**
   * 다운로드 시간 기록
   */
  recordDownload(durationMs: number): void {
    if (!this.currentFeed) return;

    const durationS = durationMs / 1000;
    this.currentFeed.download_time_s = durationS;
    this.downloadTimes.push(durationS);
  }

  /**
   * 파싱 시간 기록
   */
  recordParse(durationMs: number, storyCount: number): void {
    if (!this.currentFeed) return;

    const durationS = durationMs / 1000;
    this.currentFeed.parse_time_s = durationS;
    this.currentFeed.stories_created = storyCount;
    this.parseTimes.push(durationS);
  }

  /**
   * Story 생성 시간 및 결과 기록
   */
  recordStoryCreation(durationMs: number, result: StoryCreationResult): void {
    if (!this.currentFeed) return;

    const durationS = durationMs / 1000;
    this.currentFeed.create_time_s = durationS;
    this.createTimes.push(durationS);

    this.dbWriteBreakdown.insert += result.insert;
    this.dbWriteBreakdown.update += result.update;
    this.dbWriteBreakdown.skip += result.skip;

    this.currentFeed.stories_failed = result.error ?? 0;

    this.finishCurrentFeed();
  }

  /**
   * 에러 기록
   */
  recordError(feedUrl: string, error: unknown, errorType: ErrorType): void {
    this.errorBreakdown[errorType]++;

    if (this.currentFeed) {
      this.currentFeed.error = error instanceof Error ? error.message : String(error);
      this.currentFeed.error_type = errorType;
      this.finishCurrentFeed();
    } else {
      this.feedMetrics.push({
        feed_url: feedUrl,
        download_time_s: 0,
        parse_time_s: 0,
        create_time_s: 0,
        stories_created: 0,
        stories_failed: 0,
        error: error instanceof Error ? error.message : String(error),
        error_type: errorType,
      });
    }
  }

  /**
   * 현재 피드 메트릭 완료 처리
   */
  private finishCurrentFeed(): void {
    if (this.currentFeed && this.currentFeed.feed_url) {
      this.feedMetrics.push(this.currentFeed as FeedMetrics);
      this.currentFeed = null;
    }
  }

  /**
   * P95 계산
   */
  private calculateP95(values: number[]): number {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    return sorted[p95Index] ?? sorted[sorted.length - 1];
  }

  /**
   * 평균 계산
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * 성능 리포트 생성
   */
  generateReport(): PerformanceReport {
    const totalExecutionTimeS = (Date.now() - this.startTime) / 1000;

    const feedsProcessed = this.feedMetrics.length;
    const storiesCreated = this.dbWriteBreakdown.insert + this.dbWriteBreakdown.update;
    const storiesFailed = this.feedMetrics.reduce((sum, feed) => sum + feed.stories_failed, 0);

    const totalStoriesAttempted = storiesCreated + storiesFailed;
    const feedsWithErrors = this.feedMetrics.filter((f) => f.error).length;

    const slowestFeed = this.feedMetrics.reduce(
      (slowest, feed) => {
        const totalTime = feed.download_time_s + feed.parse_time_s + feed.create_time_s;
        return totalTime > slowest.time ? { url: feed.feed_url, time: totalTime } : slowest;
      },
      { url: '', time: 0 },
    );

    return {
      timestamp: new Date().toISOString(),
      total_execution_time_s: parseFloat(totalExecutionTimeS.toFixed(2)),

      feeds_processed: feedsProcessed,
      stories_created: storiesCreated,
      stories_failed: storiesFailed,

      avg_download_s: parseFloat(this.calculateAverage(this.downloadTimes).toFixed(2)),
      avg_parse_s: parseFloat(this.calculateAverage(this.parseTimes).toFixed(2)),
      avg_create_s: parseFloat(this.calculateAverage(this.createTimes).toFixed(2)),

      p95_download_s: parseFloat(this.calculateP95(this.downloadTimes).toFixed(2)),
      p95_parse_s: parseFloat(this.calculateP95(this.parseTimes).toFixed(2)),
      p95_create_s: parseFloat(this.calculateP95(this.createTimes).toFixed(2)),

      feed_error_rate: feedsProcessed > 0 ? parseFloat((feedsWithErrors / feedsProcessed).toFixed(4)) : 0,
      story_error_rate:
        totalStoriesAttempted > 0 ? parseFloat((storiesFailed / totalStoriesAttempted).toFixed(4)) : 0,

      slowest_feed_url: slowestFeed.url,
      slowest_feed_time_s: parseFloat(slowestFeed.time.toFixed(2)),

      error_breakdown: { ...this.errorBreakdown },
      db_write_breakdown: { ...this.dbWriteBreakdown },

      feed_details: this.feedMetrics.map((feed) => ({
        ...feed,
        download_time_s: parseFloat(feed.download_time_s.toFixed(2)),
        parse_time_s: parseFloat(feed.parse_time_s.toFixed(2)),
        create_time_s: parseFloat(feed.create_time_s.toFixed(2)),
      })),
    };
  }

  /**
   * JSON 파일로 저장
   */
  async saveToFile(): Promise<string> {
    const report = this.generateReport();

    const timestamp = new Date()
      .toISOString()
      .replace(/:/g, '-')
      .replace(/\.\d+Z$/, '');
    const filename = `report_${timestamp}.json`;

    const reportsDir = join(process.cwd(), 'reports');
    await mkdir(reportsDir, { recursive: true });

    const filepath = join(reportsDir, filename);
    await writeFile(filepath, JSON.stringify(report, null, 2), 'utf-8');

    return filepath;
  }

  /**
   * 콘솔 요약 출력
   */
  printConsoleSummary(): void {
    const report = this.generateReport();

    console.log('\n========================================');
    console.log('📊 Performance Summary');
    console.log('========================================');
    console.log(
      `Total Time: ${report.total_execution_time_s}s | Feeds: ${report.feeds_processed} | Stories: ${report.stories_created} created, ${report.stories_failed} failed`,
    );
    console.log(
      `Latency (avg/p95): Download ${report.avg_download_s}s/${report.p95_download_s}s | Parse ${report.avg_parse_s}s/${report.p95_parse_s}s | Create ${report.avg_create_s}s/${report.p95_create_s}s`,
    );

    const errorSummary = Object.entries(report.error_breakdown)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${type}(${count})`)
      .join(', ');

    const dbSummary = `insert(${report.db_write_breakdown.insert}), update(${report.db_write_breakdown.update}), skip(${report.db_write_breakdown.skip})`;

    console.log(`Errors: ${errorSummary || 'none'} | DB: ${dbSummary}`);
    console.log('========================================\n');
  }
}
