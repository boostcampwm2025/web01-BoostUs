import type { Member } from '@/shared/types/MemberType';

export type StoriesRankingPeriods = '전체' | '이번 달' | '이번 주' | '오늘';

export interface StoriesRankingPeriodState {
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
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
