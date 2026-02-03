import { Project } from '@/features/project/api/getProjects';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { customFetch } from '@/shared/utils/fetcher';

export const fetchRecoProject = async (): Promise<ApiResponse<Project[]>> => {
  return customFetch<ApiResponse<Project[]>>(`/api/recommend`);
};
