export interface User {
  id: number;
  nickname: string;
  avatarUrl: string;
  cohort: number;
}

export interface Question {
  id: number;
  title: string;
  summary: string;
  hashtags: string[];
  likeCount: number;
  viewCount: number;
  answerCount: number;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}
