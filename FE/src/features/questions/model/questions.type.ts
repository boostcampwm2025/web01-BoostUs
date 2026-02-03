import { Member } from '@/shared/types/MemberType';

export type QuestionsStatusFilter =
  | 'all'
  | 'unanswered'
  | 'unsolved'
  | 'solved';

export type QuestionsSortBy = 'latest' | 'likes' | 'views';

export type Reaction = 'LIKE' | 'DISLIKE' | 'NONE';

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
  reaction: Reaction;
}

export interface QuestionDetail extends Question {
  contents: string;
}

export interface Answer {
  id: string;
  questionId: string;
  contents: string;
  upCount: number;
  downCount: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  member: Member;
  reaction: Reaction;
}

export interface QuestionCounts {
  total: number;
  noAnswer: number;
  unsolved: number;
  solved: number;
}
