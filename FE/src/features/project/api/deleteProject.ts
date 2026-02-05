import { customFetch } from '@/shared/utils/fetcher';
import { ApiResponse } from '@/shared/types/ApiResponseType';

export const deleteProject = async (projectId: number) => {
  const data = await customFetch<ApiResponse<{ id: number }>>(
    `/api/projects/${projectId.toString()}`,
    {
      method: 'DELETE',
    }
  );
  return data.data;
};
