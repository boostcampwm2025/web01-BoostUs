/**
 * next.config.ts의 images.remotePatterns와 동기화되어야 하는 리스트입니다.
 * 이 도메인들은 Next/Image 최적화를 사용하고, 그 외는 일반 img 태그를 사용합니다.
 */
export const OPTIMIZED_IMAGE_DOMAINS = [
  'blog.kakaocdn.net',
  'velog.velcdn.com',
  'images.velog.io',
  'githubusercontent.com', // 서브도메인 와일드카드 대응을 위해 로직에서 체크 필요
  'kr.object.ncloudstorage.com',
] as const;
