import { ProjectResponse } from '@/entities/projectDetail/model/types';

export const fetchProjectDetail = async ({
  id,
}: {
  id: number;
}): Promise<ProjectResponse> => {
  const res = await fetch(`/api/projects/${String(id)}`, { cache: 'no-cache' });

  if (!res.ok) {
    throw new Error('프로젝트 조회 실패');
  }

  return (await res.json()) as ProjectResponse;
};
