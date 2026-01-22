/**
 * RSS Feed 타입
 */
export interface Feed {
  id: string;
  feedUrl: string;
  memberId: string;
  lastFetchedAt: string;
  state: string;
}

/**
 * Feed 목록 응답 (내부 데이터)
 */
export interface FeedListData {
  items: Feed[];
}

/**
 * BE API 래핑된 응답
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  error?: unknown;
  data: T;
}

/**
 * Feed 목록 응답
 */
export type FeedListResponse = ApiResponse<FeedListData>;

/**
 * Story 생성 요청 DTO
 */
export interface CreateStoryRequest {
  feedId: string;
  guid: string;
  title: string;
  summary?: string;
  contents: string;
  thumbnailUrl?: string;
  originalUrl?: string;
  publishedAt: string;
}

/**
 * Story 생성 응답 데이터
 */
export interface CreateStoryData {
  id: string;
  guid: string;
  title: string;
  createdAt: string;
  message: string;
}

/**
 * Story 생성 응답 DTO (래핑됨)
 */
export type CreateStoryResponse = ApiResponse<CreateStoryData>;

/**
 * RSS Item (파싱된 데이터)
 */
export interface RssItem {
  guid: string;
  title: string;
  link?: string;
  pubDate?: string;
  content?: string;
  summary?: string;
}
