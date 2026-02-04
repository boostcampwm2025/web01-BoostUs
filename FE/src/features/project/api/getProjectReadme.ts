import { customFetch } from '@/shared/utils/fetcher';

export interface ProjectReadmeData {
  name: string;
  path: string;
  htmlUrl: string;
  downloadUrl: string | null;
  encoding: string;
  content: string;
}

export async function getProjectReadme(repositoryUrl: string) {
  const encodedRepository = encodeURIComponent(repositoryUrl);
  const json = await customFetch<{
    success: boolean;
    message: string;
    error: unknown;
    data: ProjectReadmeData;
  }>(`/api/projects/readme?repository=${encodedRepository}`);

  return json.data;
}
