import { customFetch } from '@/shared/utils/fetcher';

interface UpdateProjectBody {
  title: string;
  repoUrl: string;
  thumbnailUploadId: string | null;
  thumbnailUrl: string | null;
  description: string;
  contents: string;
  demoUrl: string;
  cohort: number;
  techStack: string[];
  startDate: string;
  endDate: string;
  field: string;
  participants: string[];
}

export const updateProject = async (id: number, body: UpdateProjectBody) => {
  return customFetch<unknown>(`/api/projects/${id.toString()}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};
