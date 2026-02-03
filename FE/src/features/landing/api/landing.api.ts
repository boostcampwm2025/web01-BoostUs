import type { LandingData } from '../model/landing.type';
import type { ApiResponse } from '@/shared/types/ApiResponseType';
import { customFetch } from '@/shared/utils/fetcher';

export const LANDING_STATS_KEY = ['landing-stats'];

export const getLandingCount = async (options?: {
  skipStore?: boolean;
}): Promise<LandingData> => {
  const response = await customFetch<ApiResponse<LandingData>>(
    `/api/landing/count`,
    {
      skipStore: options?.skipStore,
    }
  );
  return response.data;
};
