import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { PerformanceReport } from '../types';

/**
 * Report Service
 * JSON 리포트 파일을 읽고 집계하는 서비스
 */
export class ReportService {
  private reportsDir: string;

  constructor(reportsDir = join(process.cwd(), 'reports')) {
    this.reportsDir = reportsDir;
  }

  /**
   * 모든 리포트 파일명 조회 (최신순)
   */
  async getReportFiles(limit?: number): Promise<string[]> {
    try {
      const files = await readdir(this.reportsDir);
      const jsonFiles = files
        .filter((f) => f.startsWith('report_') && f.endsWith('.json'))
        .sort()
        .reverse(); // 최신순 정렬

      return limit ? jsonFiles.slice(0, limit) : jsonFiles;
    } catch (error) {
      console.error('Error reading reports directory:', error);
      return [];
    }
  }

  /**
   * 특정 리포트 파일 읽기
   */
  async getReport(filename: string): Promise<PerformanceReport | null> {
    try {
      const filepath = join(this.reportsDir, filename);
      const content = await readFile(filepath, 'utf-8');
      return JSON.parse(content) as PerformanceReport;
    } catch (error) {
      console.error(`Error reading report ${filename}:`, error);
      return null;
    }
  }

  /**
   * 최근 N개 리포트 조회
   */
  async getRecentReports(limit = 200): Promise<PerformanceReport[]> {
    const files = await this.getReportFiles(limit);
    const reports: PerformanceReport[] = [];

    for (const file of files) {
      const report = await this.getReport(file);
      if (report) {
        reports.push(report);
      }
    }

    return reports;
  }

  /**
   * 집계 통계 계산
   */
  async getSummaryMetrics(limit = 200): Promise<{
    total_runs: number;
    avg_execution_time_s: number;
    avg_feeds_processed: number;
    avg_stories_created: number;
    total_stories_created: number;
    avg_feed_error_rate: number;
    avg_story_error_rate: number;
    recent_reports: PerformanceReport[];
  }> {
    const reports = await this.getRecentReports(limit);

    if (reports.length === 0) {
      return {
        total_runs: 0,
        avg_execution_time_s: 0,
        avg_feeds_processed: 0,
        avg_stories_created: 0,
        total_stories_created: 0,
        avg_feed_error_rate: 0,
        avg_story_error_rate: 0,
        recent_reports: [],
      };
    }

    const totalExecutionTime = reports.reduce((sum, r) => sum + r.total_execution_time_s, 0);
    const totalFeedsProcessed = reports.reduce((sum, r) => sum + r.feeds_processed, 0);
    const totalStoriesCreated = reports.reduce((sum, r) => sum + r.stories_created, 0);
    const totalFeedErrorRate = reports.reduce((sum, r) => sum + r.feed_error_rate, 0);
    const totalStoryErrorRate = reports.reduce((sum, r) => sum + r.story_error_rate, 0);

    return {
      total_runs: reports.length,
      avg_execution_time_s: parseFloat((totalExecutionTime / reports.length).toFixed(2)),
      avg_feeds_processed: parseFloat((totalFeedsProcessed / reports.length).toFixed(2)),
      avg_stories_created: parseFloat((totalStoriesCreated / reports.length).toFixed(2)),
      total_stories_created: totalStoriesCreated,
      avg_feed_error_rate: parseFloat((totalFeedErrorRate / reports.length).toFixed(4)),
      avg_story_error_rate: parseFloat((totalStoryErrorRate / reports.length).toFixed(4)),
      recent_reports: reports,
    };
  }
}
