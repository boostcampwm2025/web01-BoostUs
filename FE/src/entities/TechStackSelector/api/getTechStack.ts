import { ApiResponse } from '@/shared/types/ApiResponseType';
import { TechStackResponse } from '@/entities/TechStackSelector/model/types';

export const fetchStacks = async (): Promise<TechStackResponse> => {
  const res = await fetch('/api/tech-stacks');

  if (!res.ok) throw new Error('테크스택 조회 실패');

  return res.json() as Promise<TechStackResponse>;
};
