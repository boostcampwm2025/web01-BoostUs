import axios, { AxiosInstance } from 'axios';
import {
  CreateStoryRequest,
  CreateStoryResponse,
  Feed,
  FeedListResponse,
  StoryCreationResult,
  StoryOperationType,
} from '../types';

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

      const response = await this.client.post<CreateStoryResponse>('/stories', story);

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
   * @returns Story 생성 결과 통계
   */
  async createStories(stories: CreateStoryRequest[]): Promise<StoryCreationResult> {
    console.log(`📝 Creating ${stories.length} stories...`);

    let insertCount = 0;
    let updateCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const story of stories) {
      try {
        const response = await this.createStory(story);

        // enum 기반으로 명확하게 구분
        switch (response.data.meta.operation) {
          case StoryOperationType.CREATED:
            insertCount++;
            break;
          case StoryOperationType.UPDATED:
            updateCount++;
            break;
          case StoryOperationType.UNCHANGED:
            skipCount++;
            break;
          default:
            throw new Error(`Unknown operation type: ${response.data.meta.operation}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`Failed to create story: ${story.title}`, error);
      }
    }

    console.log(
      `✅ Created ${insertCount} stories (${updateCount} updated, ${skipCount} skipped, ${errorCount} errors)`,
    );

    return {
      insert: insertCount,
      update: updateCount,
      skip: skipCount,
      total: insertCount + updateCount + skipCount,
      error: errorCount,
    };
  }
}
