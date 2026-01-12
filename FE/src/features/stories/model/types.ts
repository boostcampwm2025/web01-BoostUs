export type StoriesRankingPeriod = '전체' | '이번 달' | '이번 주' | '오늘';

export interface StoriesRankingState {
  isOpen: boolean;
  selected: StoriesRankingPeriod;
}
