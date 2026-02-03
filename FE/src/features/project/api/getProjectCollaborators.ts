import { customFetch } from '@/shared/utils/fetcher';

export interface ProjectCollaborator {
  githubId: string;
  avatarUrl: string | null;
}

export async function getProjectCollaborators(repositoryUrl: string) {
  const encodedRepository = encodeURIComponent(repositoryUrl);
  const json = await customFetch<{
    success: boolean;
    message: string;
    error: unknown;
    data: ProjectCollaborator[];
  }>(`/api/projects/collaborators?repository=${encodedRepository}`);

  return json.data;
}
