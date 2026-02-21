import axios from 'axios';
import { BeApiClient } from '../clients/be-api-client';
import { FeedDownloader } from './feed-downloader';
import { FeedParser } from './feed-parser';
import { PerformanceMetrics } from '../monitoring/performance-metrics';
import { ErrorType } from '../types';

/**
 * Feed Manager
 * 피드 수집 프로세스를 오케스트레이션합니다.
 */
export class FeedManager {
  private apiClient: BeApiClient;
  private downloader: FeedDownloader;
  private parser: FeedParser;

  constructor(beApiUrl: string) {
    this.apiClient = new BeApiClient(beApiUrl);
    this.downloader = new FeedDownloader();
    this.parser = new FeedParser();
  }

  /**
   * 에러 타입 분류
   */
  private classifyError(error: unknown): ErrorType {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return 'timeout';
      }
      if (error.response?.status && error.response.status >= 400) {
        return 'http_error';
      }
      return 'network_error';
    }
    if (error instanceof Error && error.message.toLowerCase().includes('parse')) {
      return 'parse_error';
    }
    return 'unknown';
  }

  /**
   * 모든 피드를 수집하고 스토리를 생성합니다.
   */
  async collectAllFeeds(): Promise<void> {
    console.log('\n========================================');
    console.log('🚀 Starting RSS feed collection...');
    console.log('========================================\n');

    const metrics = new PerformanceMetrics();

    try {
      const feeds = await this.apiClient.getFeeds();

      if (feeds.length === 0) {
        console.log('⚠️  No active feeds found');
        return;
      }

      console.log(`\n📋 Processing ${feeds.length} feed(s)...\n`);

      for (const feed of feeds) {
        metrics.startFeed(feed.feedUrl);

        try {
          console.log(`\n--- Processing feed: ${feed.feedUrl} ---`);

          // 1. 피드 다운로드
          const downloadStart = Date.now();
          const xmlContent = await this.downloader.download(feed.feedUrl);
          metrics.recordDownload(Date.now() - downloadStart);

          // 2. 피드 파싱
          const parseStart = Date.now();
          const stories = await this.parser.parse(xmlContent, feed.id);
          metrics.recordParse(Date.now() - parseStart, stories.length);

          // 3. 스토리 생성
          if (stories.length > 0) {
            const createStart = Date.now();
            const result = await this.apiClient.createStories(stories);
            metrics.recordStoryCreation(Date.now() - createStart, result);
          } else {
            console.log('⚠️  No stories to create');
            metrics.recordStoryCreation(0, { insert: 0, update: 0, skip: 0, total: 0, error: 0 });
          }

          console.log(`✅ Finished processing feed: ${feed.feedUrl}\n`);
        } catch (error) {
          const errorType = this.classifyError(error);
          metrics.recordError(feed.feedUrl, error, errorType);
          console.error(`❌ Error processing feed ${feed.feedUrl}:`, error);
        }
      }

      console.log('\n========================================');
      console.log('✅ Feed collection completed!');
      console.log('========================================\n');
    } catch (error) {
      console.error('\n❌ Fatal error during feed collection:', error);
      throw error;
    } finally {
      try {
        await metrics.saveToFile();
        metrics.printConsoleSummary();
      } catch (error) {
        console.error('❌ Error saving performance report:', error);
      }
    }
  }
}
