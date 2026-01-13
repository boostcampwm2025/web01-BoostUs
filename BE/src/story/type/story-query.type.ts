/**
 * Story 정렬 기준 상수
 */
export const STORY_SORT_BY = {
  LATEST: 'latest',
  VIEWS: 'views',
  LIKES: 'likes',
} as const;

/**
 * Story 집계 기간 상수
 */
export const STORY_PERIOD = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  ALL: 'all',
} as const;

/**
 * Story 정렬 기준 배열 (validation용)
 */
export const STORY_SORT_BY_VALUES = Object.values(STORY_SORT_BY);

/**
 * Story 집계 기간 배열 (validation용)
 */
export const STORY_PERIOD_VALUES = Object.values(STORY_PERIOD);

/**
 * Story 정렬 기준 타입
 */
export type StorySortBy = (typeof STORY_SORT_BY)[keyof typeof STORY_SORT_BY];

/**
 * Story 집계 기간 타입
 */
export type StoryPeriod = (typeof STORY_PERIOD)[keyof typeof STORY_PERIOD];
