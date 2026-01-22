import type { Member } from '@/shared/types/MemberType';

export type StoriesRankingPeriods = 'daily' | 'weekly' | 'monthly' | 'all';

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

export interface Story {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  likeCount: number;
  viewCount: number;
  originalUrl: string;
  createdAt: string;
  member: {
    id: string;
    nickname: string;
    cohort: number;
    avatarUrl: string;
  };
}

export interface StoryDetail {
  id: string;
  title: string;
  thumbnailUrl: string;
  likeCount: number;
  viewCount: number;
  originalUrl: string;
  createdAt: string;
  contents: string;
  member: {
    id: string;
    nickname: string;
    cohort: number;
    avatarUrl: string;
  };
}

export interface StoriesSortOption {
  sortBy: 'latest' | 'views' | 'likes';
  period: 'all' | 'daily' | 'weekly' | 'monthly';
}
