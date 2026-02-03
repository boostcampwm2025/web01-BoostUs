import { customFetch } from '@/shared/utils/fetcher';

interface RegisterProjectRequest {
  thumbnailUploadId?: string | null;

  thumbnailUrl?: string | null;

  title: string;

  description?: string | null;
  contents?: string | null;

  repoUrl: string;
  demoUrl?: string | null;

  cohort: number;

  techStack?: string[] | null;

  startDate: string;
  endDate: string;

  field: string;

  participants?: string[] | null;
}

export async function registerProject(data: RegisterProjectRequest) {
  const json = await customFetch<{
    success: boolean;
    message: string;
    error: unknown;
    data: { id: number };
  }>('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return json.data.id;
}
