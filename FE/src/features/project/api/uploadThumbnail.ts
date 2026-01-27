export interface UploadThumbnailResponse {
  thumbnailUploadId: string;
  thumbnailUrl: string;
}

export async function uploadThumbnail(
  file: File
): Promise<UploadThumbnailResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/projects/uploads/thumbnails', {
    method: 'POST',
    credentials: 'include', // 쿠키 기반 인증
    body: formData,
    // FormData 사용 시 Content-Type 헤더를 설정하지 않음 (브라우저가 자동 설정)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`썸네일 업로드 실패: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
