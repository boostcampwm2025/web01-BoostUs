import { Member } from '@/shared/types/MemberType';

export interface Question {
  id: number;
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
