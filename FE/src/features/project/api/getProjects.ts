import { customFetch } from '@/shared/utils/fetcher';

export const PROJECT_KEYS = {
  all: ['projects'] as const,
};

export type SortOrder = 'TEAM_NUM' | 'VIEW_COUNT';

export interface Project {
  id: number;
  teamNumber: number;
  thumbnailUrl: string | null;
  title: string;
  description: string;
  cohort: number;
  techStack: string[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  field: string;
}

export interface ProjectsMeta {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface ProjectsData {
  items: Project[];
  meta: ProjectsMeta;
}

export async function fetchProjects(params?: {
  skipStore?: boolean;
}): Promise<ProjectsData> {
  const json = await customFetch<{
    success: boolean;
    message: string;
    error: unknown;
    data: ProjectsData;
  }>('/api/projects', { skipStore: params?.skipStore, tags: ['projects'] });

  return {
    ...json.data,
    items: json.data.items.map((p) => ({
      ...p,
      viewCount: p.viewCount,
    })),
  };
}
