import { Member } from '@/shared/types/MemberType';

export type QuestionsStatusFilter =
  | 'all'
  | 'unanswered'
  | 'unsolved'
  | 'solved';

export type QuestionsSortBy = 'latest' | 'likes' | 'views';

export interface Question {
  id: string;
  title: string;
  hashtags: string[];
  upCount: number;
  downCount: number;
  viewCount: number;
  answerCount: number;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
  member: Member;
}

export interface QuestionDetail extends Question {
  contents: string;
}

export interface Answer {
  id: string;
  contents: string;
  upCount: number;
  downCount: number;
  isAceepted: boolean;
  createdAt: string;
  user: Member;
}

export interface QuestionCounts {
  total: number;
  noAnswer: number;
  unsolved: number;
  solved: number;
}
