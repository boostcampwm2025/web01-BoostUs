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
