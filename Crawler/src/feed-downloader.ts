import axios from 'axios';

/**
 * Feed Downloader
 * RSS 피드 URL에서 XML 원문을 다운로드합니다.
 */
export class FeedDownloader {
  /**
   * RSS 피드 다운로드
   * @param feedUrl RSS 피드 URL
   * @returns XML 문자열
   */
  async download(feedUrl: string): Promise<string> {
    try {
      console.log(`📥 Downloading feed from: ${feedUrl}`);
      
      const response = await axios.get(feedUrl, {
        headers: {
          'User-Agent': 'BoostUs-RSS-Crawler/1.0',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        },
        timeout: 30000, // 30초 타임아웃
      });

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ Successfully downloaded feed from: ${feedUrl}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`❌ Failed to download feed from ${feedUrl}:`, error.message);
        throw new Error(`Failed to download RSS feed: ${error.message}`);
      }
      throw error;
    }
  }
}
