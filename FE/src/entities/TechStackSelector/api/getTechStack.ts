import { TechStackResponse } from '@/entities/TechStackSelector/model/types';
import { customFetch } from '@/shared/utils/fetcher';
import { ApiResponse } from '@/shared/types/ApiResponseType';
export const fetchStacks = async () => {
  const res =
    await customFetch<ApiResponse<TechStackResponse>>('/api/tech-stacks');

  return res;
};
