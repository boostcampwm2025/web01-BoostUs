import { customFetch } from '@/shared/utils/fetcher';
import type { ApiResponse } from '@/shared/types/ApiResponseType';

export interface UploadThumbnailResponse {
  thumbnailUploadId: string;
  thumbnailUrl: string;
}

export async function uploadThumbnail(
  file: File
): Promise<UploadThumbnailResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const json = await customFetch<ApiResponse<UploadThumbnailResponse>>(
    '/api/projects/uploads/thumbnails',
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }
  );

  return json.data;
}
