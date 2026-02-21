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
 * Story Operation 타입
 */
export enum StoryOperationType {
  CREATED = 'created',
  UPDATED = 'updated',
  UNCHANGED = 'unchanged',
}

/**
 * Story Operation 메타데이터
 */
export interface StoryOperationMeta {
  operation: StoryOperationType;
  isNewStory: boolean;
  hasChanges: boolean;
}

/**
 * Story 기본 데이터
 */
export interface StoryData {
  id: string;
  guid: string;
  title: string;
  createdAt: string;
}

/**
 * Story 생성 응답 데이터
 */
export interface CreateStoryData {
  story: StoryData;
  meta: StoryOperationMeta;
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

/**
 * Story 생성 결과 통계
 */
export interface StoryCreationResult {
  insert: number;
  update: number;
  skip: number;
  total: number;
  error: number;
}

/**
 * 에러 타입
 */
export type ErrorType = 'timeout' | 'parse_error' | 'http_error' | 'network_error' | 'unknown';

/**
 * 개별 피드 메트릭
 */
export interface FeedMetrics {
  feed_url: string;
  download_time_s: number;
  parse_time_s: number;
  create_time_s: number;
  stories_created: number;
  stories_failed: number;
  error?: string;
  error_type?: ErrorType;
}

/**
 * 에러 분류 통계
 */
export interface ErrorBreakdown {
  timeout: number;
  parse_error: number;
  http_error: number;
  network_error: number;
  unknown: number;
}

/**
 * DB Write 분류 통계
 */
export interface DbWriteBreakdown {
  insert: number;
  update: number;
  skip: number;
}

/**
 * 성능 리포트 (JSON 저장용)
 */
export interface PerformanceReport {
  timestamp: string;
  total_execution_time_s: number;

  feeds_processed: number;
  stories_created: number;
  stories_failed: number;

  avg_download_s: number;
  avg_parse_s: number;
  avg_create_s: number;

  p95_download_s: number;
  p95_parse_s: number;
  p95_create_s: number;

  feed_error_rate: number;
  story_error_rate: number;

  slowest_feed_url: string;
  slowest_feed_time_s: number;

  error_breakdown: ErrorBreakdown;
  db_write_breakdown: DbWriteBreakdown;

  feed_details: FeedMetrics[];
}
