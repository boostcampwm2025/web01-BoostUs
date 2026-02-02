import type { LandingData } from '../model/landing.type';
import type { ApiResponse } from '@/shared/types/ApiResponseType';
import { customFetch } from '@/shared/utils/fetcher';

export const getLandingCount = async (): Promise<LandingData> => {
  const data = await customFetch<ApiResponse<LandingData>>(
    `/api/landing/count`,
    {
      cache: 'no-store',
    }
  );

  return data.data;
};
