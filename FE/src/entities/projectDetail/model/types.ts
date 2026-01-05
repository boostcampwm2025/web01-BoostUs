export interface Member {
  id: number;
  nickname: string;
  avatarUrl: string;
}

export interface ProjectData {
  id: number;
  thumbnailUrl: string;
  title: string;
  description: string;
  stacks: string[];
  summary: string;
  contents: string; // Markdown 텍스트
  repositoryUrl: string;
  demoUrl: string;
  cohort: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  members: Member[];
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  error: null | string;
  data: ProjectData;
}
