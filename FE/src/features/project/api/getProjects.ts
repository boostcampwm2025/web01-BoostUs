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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  error: unknown;
  data: T;
}

export async function fetchProjects(): Promise<ProjectsData> {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('프로젝트 조회 실패');

  const json = (await res.json()) as ApiResponse<ProjectsData>;

  return {
    ...json.data,
    items: json.data.items.map((p) => ({
      ...p,
      viewCount: p.viewCount,
    })),
  };
}
