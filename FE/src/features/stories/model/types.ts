import type { Member } from '@/shared/types/MemberType';

export type StoriesRankingPeriod = '전체' | '이번 달' | '이번 주' | '오늘';

export interface StoriesRankingState {
  isOpen: boolean;
  selected: StoriesRankingPeriod;
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
