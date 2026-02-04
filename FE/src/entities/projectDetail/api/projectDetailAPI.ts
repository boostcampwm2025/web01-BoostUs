import { ProjectResponse } from '@/entities/projectDetail/model/types';
import { customFetch } from '@/shared/utils/fetcher';
import { ApiResponse } from '@/shared/types/ApiResponseType';

export const fetchProjectDetail = async ({ id }: { id: number }) => {
  const res = await customFetch<ApiResponse<ProjectResponse>>(
    `/api/projects/${String(id)}`,
    {
      cache: 'no-cache',
    }
  );

  return res;
};
