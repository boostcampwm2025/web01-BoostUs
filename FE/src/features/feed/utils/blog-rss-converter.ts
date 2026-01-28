export type BlogPlatform = 'velog' | 'tistory' | 'custom';

/**
 * Velog 블로그 URL을 RSS URL로 변환
 * @param blogUrl 예: https://velog.io/@myblog 또는 velog.io/@myblog
 * @returns RSS URL 예: https://v2.velog.io/rss/@myblog
 */
export function convertVelogToRss(blogUrl: string): string {
  // http:// 또는 https:// 제거 후 정규화
  const normalized = blogUrl.replace(/^https?:\/\//, '');

  // velog.io/@username 형식 매칭
  const match = normalized.match(/^velog\.io\/(@[\w-]+)/);

  if (!match) {
    throw new Error('유효하지 않은 Velog 블로그 주소입니다.');
  }

  const username = match[1]; // @myblog
  return `https://v2.velog.io/rss/${username}`;
}

/**
 * Tistory 블로그 URL을 RSS URL로 변환
 * @param blogUrl 예: https://myblog.tistory.com 또는 myblog.tistory.com
 * @returns RSS URL 예: https://myblog.tistory.com/rss
 */
export function convertTistoryToRss(blogUrl: string): string {
  // http:// 또는 https:// 제거 후 정규화
  const normalized = blogUrl.replace(/^https?:\/\//, '');

  // subdomain.tistory.com 형식 매칭
  const match = normalized.match(/^([\w-]+)\.tistory\.com\/?$/);

  if (!match) {
    throw new Error('유효하지 않은 Tistory 블로그 주소입니다.');
  }

  const subdomain = match[1]; // myblog
  return `https://${subdomain}.tistory.com/rss`;
}

/**
 * 블로그 플랫폼과 URL을 받아 RSS URL로 변환
 * @param platform 블로그 플랫폼
 * @param blogUrl 블로그 주소
 * @returns RSS URL
 */
export function convertBlogUrlToRss(
  platform: BlogPlatform,
  blogUrl: string
): string {
  if (platform === 'custom') {
    // 직접 입력한 경우 그대로 반환 (이미 RSS URL이거나 전체 URL)
    return blogUrl;
  }

  if (platform === 'velog') {
    return convertVelogToRss(blogUrl);
  }

  if (platform === 'tistory') {
    return convertTistoryToRss(blogUrl);
  }

  throw new Error('지원하지 않는 블로그 플랫폼입니다.');
}

/**
 * RSS URL에서 원본 블로그 URL 추출 (역변환)
 * @param rssUrl RSS URL
 * @returns 원본 블로그 URL 또는 null
 */
export function extractBlogUrlFromRss(rssUrl: string): string | null {
  // Velog RSS: https://v2.velog.io/rss/@username
  // 원본: https://velog.io/@username
  const velogMatch = rssUrl.match(/v2\.velog\.io\/rss\/(@[\w-]+)/);
  if (velogMatch) {
    const username = velogMatch[1];
    return `https://velog.io/${username}`;
  }

  // Tistory RSS: https://subdomain.tistory.com/rss
  // 원본: https://subdomain.tistory.com
  const tistoryMatch = rssUrl.match(/https?:\/\/([\w-]+)\.tistory\.com\/rss/);
  if (tistoryMatch) {
    const subdomain = tistoryMatch[1];
    return `https://${subdomain}.tistory.com`;
  }

  return null;
}

/**
 * 블로그 URL에서 플랫폼 자동 감지
 * @param blogUrl 블로그 주소 (http/https 포함 또는 생략)
 * @returns 감지된 플랫폼 또는 null
 */
export function detectPlatformFromBlogUrl(blogUrl: string): BlogPlatform | null {
  const normalized = blogUrl.replace(/^https?:\/\//, '');

  if (/^velog\.io\/@[\w-]+/.test(normalized)) {
    return 'velog';
  }

  if (/^[\w-]+\.tistory\.com(\/|$)/.test(normalized)) {
    return 'tistory';
  }

  return null;
}

