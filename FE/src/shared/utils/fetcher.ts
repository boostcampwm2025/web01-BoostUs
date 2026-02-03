import { ApiResponse } from '@/shared/types/ApiResponseType';
import { redirect } from 'next/navigation';

type QueryParamValue = string | number | boolean | undefined | null;

type FetchOptions = RequestInit & {
  params?: Record<string, QueryParamValue>;
  _retry?: boolean; // 내부적으로 재시도 여부를 판단하기 위한 플래그
};

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL ?? 'http://backend:3000';
  }

  return '';
};

export const customFetch = async <T>(
  path: string,
  options?: FetchOptions
): Promise<T> => {
  const { params, _retry, ...fetchOptions } = options ?? {};
  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(normalizedPath, baseUrl || window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      const isString = typeof value === 'string';
      const isSensitiveKey = key === 'query' || key === 'cursor';

      const transformedValue =
        isString && !isSensitiveKey ? value.toUpperCase() : String(value);

      url.searchParams.append(key, transformedValue);
    });
  }

  const headers = new Headers(fetchOptions.headers);
  const isServer = typeof window === 'undefined';

  if (isServer) {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const cookieString = cookieStore.toString();

      if (cookieString) {
        headers.set('Cookie', cookieString);
      }
    } catch (error) {
      console.error('Failed to get cookies in server environment:', error);
    }
  }

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = (await response
      .clone()
      .json()
      .catch(() => null)) as ApiResponse<unknown> | null;

    // 토큰 만료 감지 및 갱신 (Interceptor 패턴)
    if (response.status === 401) {
      // ✅ [서버 환경] 갱신 시도 없이 바로 로그인 페이지로 리다이렉트
      if (isServer) {
        // Next.js의 redirect()는 내부적으로 에러를 던져서 작동하므로 return 불필요
        redirect('/login');
      }

      // ✅ [클라이언트 환경] 토큰 갱신 로직 실행
      if (
        !_retry &&
        (errorData?.error?.code === 'ACCESS_TOKEN_EXPIRED' ||
          errorData?.error?.code === 'REFRESH_TOKEN_EXPIRED')
      ) {
        try {
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
          });

          if (refreshResponse.ok) {
            return await customFetch<T>(path, { ...options, _retry: true });
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }

        // 갱신 실패 시 클라이언트에서도 이동
        window.location.href = '/login';
      }
    }

    // 토큰 만료가 아닌 일반 에러거나, 갱신 실패 시 에러 던지기
    throw new Error(
      errorData?.message ??
        `API Error: ${response.statusText} (${String(response.status)})`
    );
  }

  // 6. 성공 응답 반환
  return (await response.json()) as T;
};
