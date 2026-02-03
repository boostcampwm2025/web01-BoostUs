import { ApiResponse } from '@/shared/types/ApiResponseType';
import { redirect } from 'next/navigation';

type QueryParamValue = string | number | boolean | undefined | null;

type FetchOptions = RequestInit & {
  params?: Record<string, QueryParamValue>;
  _retry?: boolean; // 내부적으로 재시도 여부를 판단하기 위한 플래그
  skipStore?: boolean; // 쿠키 헤더 설정을 건너뛸지 여부
};

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL ?? 'http://backend:3000';
  }

  return '';
};

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

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

  if (isServer && !options?.skipStore) {
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

    const errorCode = errorData?.error?.code;
    const isTokenExpired =
      errorCode === 'ACCESS_TOKEN_EXPIRED' ||
      errorCode === 'REFRESH_TOKEN_EXPIRED' ||
      errorCode === 'INVALID_ACCESS_TOKEN' ||
      errorCode === 'INVALID_REFRESH_TOKEN';

    // 토큰 만료 감지 및 갱신 (Interceptor 패턴)
    // 401 에러이거나 토큰 관련 에러 코드가 있는 경우
    if (response.status === 401 || isTokenExpired) {
      // ✅ [서버 환경] 갱신 시도 없이 바로 로그인 페이지로 리다이렉트
      if (isServer) {
        redirect('/login');
      }

      // ✅ [클라이언트 환경] 토큰 갱신 로직 실행 (재시도 아닌 경우만)
      if (!_retry) {
        try {
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (refreshResponse.ok) {
            // 토큰 갱신 성공 시 원래 요청 재시도
            return await customFetch<T>(path, { ...options, _retry: true });
          }
        } catch (refreshError) {
          console.error('☠️ [Token Refresh Failed]:', refreshError);
        }

        // 갱신 실패 시 로그인 페이지로 이동
        window.location.href = '/login';
        throw new ApiError('Authentication failed', errorCode, response.status);
      }
    }

    // 토큰 만료가 아닌 일반 에러거나, 재시도 후 실패 시 에러 던지기
    console.error('☠️ [API Error]:', {
      status: response.status,
      code: errorCode,
      message: errorData?.message,
      path,
    });

    throw new ApiError(
      errorData?.message ?? `API Error: ${response.statusText}`,
      errorCode,
      response.status
    );
  }

  // 6. 성공 응답 반환
  return (await response.json()) as T;
};
