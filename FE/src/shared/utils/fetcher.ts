import { ApiResponse } from '@/shared/types/ApiResponseType';

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

  const response = await fetch(url.toString(), {
    ...fetchOptions,
  });

  if (!response.ok) {
    const errorData = (await response
      .clone()
      .json()
      .catch(() => null)) as ApiResponse<unknown> | null;

    // 토큰 만료 감지 및 갱신 (Interceptor 패턴)
    if (
      response.status === 401 &&
      (errorData?.error?.code === 'ACCESS_TOKEN_EXPIRED' ||
        errorData?.error?.code === 'REFRESH_TOKEN_EXPIRED') &&
      !_retry
    ) {
      try {
        // 토큰 재발급 요청 (쿠키 기반이므로 credentials 자동 포함)
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
        });

        // 재발급 성공 (201 Created) -> 원래 요청 재시도
        if (refreshResponse.ok) {
          // 재귀 호출: _retry를 true로 설정하여 무한 루프 방지
          return await customFetch<T>(path, { ...options, _retry: true });
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }

      // 재발급 실패 시 (리프레시 토큰도 만료됨) -> 강제 로그아웃
      if (typeof window !== 'undefined') {
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
