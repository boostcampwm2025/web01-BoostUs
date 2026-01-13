import type { Member } from '@/shared/types/MemberType';

export type StoriesRankingPeriods = '오늘' | '주간' | '월간' | '전체';

export interface StoriesRankingPeriodState {
  selected: StoriesRankingPeriods;
  selectOption: (option: StoriesRankingPeriods) => void;
  options: StoriesRankingPeriods[];
}

export interface StoriesCard {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  likeCount: number;
  viewCount: number;
  originalUrl: string;
  createdAt: string;
  member: Member;
}

export interface StoriesCardProps {
  story: StoriesCard;
}
