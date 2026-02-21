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
   * 시간 범위 기반 리포트 조회
   * @param fromTime 시작 시간
   * @param toTime 종료 시간
   * @param maxLimit 최대 조회 개수 (과도한 데이터 로드 방지)
   */
  async getReportsByTimeRange(
    fromTime: Date,
    toTime: Date,
    maxLimit = 1000,
  ): Promise<PerformanceReport[]> {
    try {
      const files = await readdir(this.reportsDir);
      const jsonFiles = files
        .filter((f) => f.startsWith('report_') && f.endsWith('.json'))
        .filter((filename) => {
          const timestamp = this.extractTimestampFromFilename(filename);
          if (!timestamp) return false;
          return timestamp >= fromTime && timestamp <= toTime;
        })
        .sort()
        .reverse()
        .slice(0, maxLimit);

      const reports: PerformanceReport[] = [];
      for (const file of jsonFiles) {
        const report = await this.getReport(file);
        if (report) {
          reports.push(report);
        }
      }

      return reports;
    } catch (error) {
      console.error('Error getting reports by time range:', error);
      return [];
    }
  }

  /**
   * 파일명에서 타임스탬프 추출
   * @param filename 예: report_2026-02-21T04-35-00.json
   * @returns Date 객체 또는 null
   */
  private extractTimestampFromFilename(filename: string): Date | null {
    const match = filename.match(/report_(.+)\.json/);
    if (!match) return null;

    const timestampStr = match[1]
      .replace(/T(\d{2})-(\d{2})-(\d{2})/, 'T$1:$2:$3');

    const date = new Date(timestampStr);

    if (isNaN(date.getTime())) return null;

    return date;
  }
}
