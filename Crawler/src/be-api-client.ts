import axios, { AxiosInstance } from 'axios';
import {
  CreateStoryRequest,
  CreateStoryResponse,
  Feed,
  FeedListResponse,
} from './types';

/**
 * BE API Client
 * BE 서버와 HTTP 통신을 담당합니다.
 */
export class BeApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 활성 피드 목록 조회
   * @returns Feed 배열
   */
  async getFeeds(): Promise<Feed[]> {
    try {
      console.log('📡 Fetching feeds from BE API...');
      
      const response = await this.client.get<FeedListResponse>('/feeds');
      
      console.log(`✅ Fetched ${response.data.data.items.length} feed(s)`);
      return response.data.data.items;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Failed to fetch feeds:', error.message);
        throw new Error(`Failed to fetch feeds: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Story 생성
   * @param story Story 생성 데이터
   * @returns 생성된 Story 정보
   */
  async createStory(story: CreateStoryRequest): Promise<CreateStoryResponse> {
    try {
      console.log(`📝 Creating story: ${story.title}`);
      
      const response = await this.client.post<CreateStoryResponse>(
        '/stories',
        story,
      );
      
      console.log(`✅ Story created: ${story.title}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`❌ Failed to create story: ${story.title}`, error.message);
        throw new Error(`Failed to create story: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * 여러 Story를 순차적으로 생성
   * @param stories Story 생성 데이터 배열
   * @returns 생성된 Story 수
   */
  async createStories(stories: CreateStoryRequest[]): Promise<number> {
    console.log(`📝 Creating ${stories.length} stories...`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const story of stories) {
      try {
        await this.createStory(story);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Failed to create story: ${story.title}`, error);
      }
    }

    console.log(`✅ Created ${successCount} stories, ${errorCount} errors`);
    return successCount;
  }
}
