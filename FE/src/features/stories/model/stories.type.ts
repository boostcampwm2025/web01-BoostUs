import type { Member } from '@/shared/types/MemberType';

export type StoriesRankingPeriods = 'daily' | 'weekly' | 'monthly' | 'all';

export interface StoriesRankingPeriodState {
  selected: StoriesRankingPeriods;
  selectOption: (option: StoriesRankingPeriods) => void;
  options: StoriesRankingPeriods[];
}

interface DefaultStoryOptions {
  id: string;
  title: string;
  thumbnailUrl: string;
  likeCount: number;
  viewCount: number;
  originalUrl: string;
  createdAt: string;
  member: Member;
}

export interface Story extends DefaultStoryOptions {
  summary: string;
}

export interface StoryDetail extends DefaultStoryOptions {
  contents: string;
  isLikedByMe: boolean;
}

export interface StoriesSortOption {
  sortBy: 'latest' | 'views' | 'likes';
  period: 'all' | 'daily' | 'weekly' | 'monthly';
}
