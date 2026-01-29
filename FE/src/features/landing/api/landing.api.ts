import { LandingData } from '../landing.type';
import { ApiResponse } from '@/shared/types/ApiResponseType';
import { customFetch } from '@/shared/utils/fetcher';

export const getLandingCount = async () => {
  const data = await customFetch<
    ApiResponse<{
      landingdata: LandingData;
    }>
  >(`/api/landing/count`, { cache: 'no-store' });

  return data.data;
};
