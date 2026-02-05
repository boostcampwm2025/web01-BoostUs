import { customFetch } from '@/shared/utils/fetcher';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { ProjectData } from '@/entities/projectDetail/model/types';

export const fetchProjectDetail = async ({ id }: { id: number }) => {
  const res = await customFetch<ApiResponse<ProjectData>>(
    `/api/projects/${String(id)}`,
    {
      cache: 'no-cache',
    }
  );

  return res;
};
