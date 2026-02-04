'use server';

import { revalidatePath } from 'next/cache';

/**
 * Server Action: 특정 경로의 ISR 캐시를 무효화합니다.
 * 클라이언트에서 안전하게 호출할 수 있습니다.
 *
 * @param path - 무효화할 경로 (예: '/project', '/stories', '/questions')
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function revalidatePageCache(path: string): Promise<void> {
  try {
    revalidatePath(path);
  } catch (error) {
    console.error(`Failed to revalidate path "${path}":`, error);
    throw new Error(`Revalidation failed for path: ${path}`);
  }
}

/**
 * 여러 경로의 ISR 캐시를 한번에 무효화합니다.
 *
 * @param paths - 무효화할 경로 배열
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function revalidateMultiplePageCaches(
  paths: string[]
): Promise<void> {
  try {
    paths.forEach((path) => {
      revalidatePath(path);
    });
  } catch (error) {
    console.error('Failed to revalidate multiple paths:', error);
    throw new Error('Revalidation failed for multiple paths');
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function revalidateUserProfileUpdate(): Promise<void> {
  try {
    // 1. 스토리 목록 (작성자 닉네임, 새 RSS 글 반영)
    revalidatePath('/stories');

    // 2. 프로젝트 목록 (참여자 닉네임 반영)
    revalidatePath('/project');

    // 3. (선택) 프로젝트 상세 페이지들은 워낙 많으므로,
    // 특정 태그(예: 'project-detail')를 심어두고 revalidateTag를 쓰는 게 가장 좋지만,
    // 지금 당장은 가장 중요한 목록 페이지들만 갱신해도 충분합니다.

    // 4. 마이페이지 (당연히 갱신)
    revalidatePath('/mypage');
  } catch (error) {
    console.error('Failed to revalidate user profile paths:', error);
  }
}
