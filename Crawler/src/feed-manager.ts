import { BeApiClient } from './be-api-client';
import { FeedDownloader } from './feed-downloader';
import { FeedParser } from './feed-parser';

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
   * 모든 피드를 수집하고 스토리를 생성합니다.
   */
  async collectAllFeeds(): Promise<void> {
    console.log('\n========================================');
    console.log('🚀 Starting RSS feed collection...');
    console.log('========================================\n');

    try {
      // 1. BE API에서 활성 피드 목록 조회
      const feeds = await this.apiClient.getFeeds();

      if (feeds.length === 0) {
        console.log('⚠️  No active feeds found');
        return;
      }

      console.log(`\n📋 Processing ${feeds.length} feed(s)...\n`);

      let totalStoriesCreated = 0;

      // 2. 각 피드를 순차적으로 처리
      for (const feed of feeds) {
        try {
          console.log(`\n--- Processing feed: ${feed.feedUrl} ---`);

          // 2.1 RSS XML 다운로드
          const xmlContent = await this.downloader.download(feed.feedUrl);

          // 2.2 XML을 Story 객체로 파싱
          const stories = await this.parser.parse(xmlContent, feed.id);

          // 2.3 BE API로 스토리 저장
          if (stories.length > 0) {
            const createdCount = await this.apiClient.createStories(stories);
            totalStoriesCreated += createdCount;
          } else {
            console.log('⚠️  No stories to create');
          }

          console.log(`✅ Finished processing feed: ${feed.feedUrl}\n`);
        } catch (error) {
          console.error(
            `❌ Error processing feed ${feed.feedUrl}:`,
            error,
          );
          // 개별 피드 에러는 무시하고 다음 피드 계속 처리
          continue;
        }
      }

      console.log('\n========================================');
      console.log(
        `✅ Feed collection completed! Total stories created: ${totalStoriesCreated}`,
      );
      console.log('========================================\n');
    } catch (error) {
      console.error('\n❌ Fatal error during feed collection:', error);
      throw error;
    }
  }
}
