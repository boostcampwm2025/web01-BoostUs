import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { customFetch } from './fetcher';

// 전역 fetch 모킹
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('customFetch (API 요청 래퍼)', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Window 객체 속성 모킹
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
        origin: 'http://localhost',
      },
      writable: true,
    });

    // [추가] scrollTo 에러 방지 (jsdom 미구현)
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const createMockResponse = (ok: boolean, status: number, data: unknown) => {
    return {
      ok,
      status,
      statusText: ok ? 'OK' : 'Error',
      json: (): Promise<unknown> => Promise.resolve(data),
      clone: () => ({
        json: (): Promise<unknown> => Promise.resolve(data),
      }),
    };
  };

  describe('1. 기본 요청 및 파라미터 처리', () => {
    it('GET 요청 시 파라미터가 쿼리 스트링으로 올바르게 변환되어야 한다', async () => {
      fetchMock.mockResolvedValue(
        createMockResponse(true, 200, { success: true })
      );

      await customFetch('/test', {
        method: 'GET',
        params: { status: 'active', page: 1 },
      });

      const expectedUrl = 'http://localhost/test?status=ACTIVE&page=1';
      expect(fetchMock).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('일반 문자열 파라미터는 대문자로 변환되지만, sensitiveKey(query, cursor)는 유지되어야 한다', async () => {
      fetchMock.mockResolvedValue(createMockResponse(true, 200, {}));

      await customFetch('/search', {
        params: {
          sort: 'desc',
          query: 'hello',
          cursor: 'next_id',
        },
      });

      const calledUrl = fetchMock.mock.calls[0][0] as string;

      expect(calledUrl).toContain('sort=DESC');
      expect(calledUrl).toContain('query=hello');
      expect(calledUrl).toContain('cursor=next_id');
    });

    it('undefined나 null 파라미터는 무시되어야 한다', async () => {
      fetchMock.mockResolvedValue(createMockResponse(true, 200, {}));

      await customFetch('/test', {
        params: { valid: 'yes', invalid: undefined, empty: null },
      });

      const calledUrl = fetchMock.mock.calls[0][0] as string;

      expect(calledUrl).toContain('valid=YES');
      expect(calledUrl).not.toContain('invalid');
      expect(calledUrl).not.toContain('empty');
    });
  });

  describe('2. 에러 핸들링', () => {
    it('응답이 실패(ok: false)하면 에러를 던져야 한다', async () => {
      const errorMsg = 'Internal Server Error';
      fetchMock.mockResolvedValue(
        createMockResponse(false, 500, { message: errorMsg })
      );

      await expect(customFetch('/error')).rejects.toThrow(errorMsg);
    });
  });

  describe('3. 토큰 재발급 로직 (Interceptor)', () => {
    it('401(ACCESS_TOKEN_EXPIRED) 발생 시 토큰 갱신 후 원래 요청을 재시도해야 한다', async () => {
      fetchMock
        .mockResolvedValueOnce(
          createMockResponse(false, 401, {
            error: { code: 'ACCESS_TOKEN_EXPIRED' },
          })
        ) // 1. 원본 실패
        .mockResolvedValueOnce(createMockResponse(true, 201, { success: true })) // 2. 갱신 성공
        .mockResolvedValueOnce(
          createMockResponse(true, 200, { data: 'final data' })
        ); // 3. 원본 재시도 성공

      const result = await customFetch('/protected-data');

      expect(result).toEqual({ data: 'final data' });
      expect(fetchMock).toHaveBeenCalledTimes(3);

      const refreshUrl = fetchMock.mock.calls[1][0] as string;
      const refreshOptions = fetchMock.mock.calls[1][1] as RequestInit;

      expect(refreshUrl).toContain('/api/auth/refresh');
      expect(refreshOptions.method).toBe('POST');
    });

    it('토큰 갱신(Refresh) 요청마저 실패하면 로그인 페이지로 이동(redirect)해야 한다', async () => {
      fetchMock
        .mockResolvedValueOnce(
          createMockResponse(false, 401, {
            error: { code: 'ACCESS_TOKEN_EXPIRED' },
          })
        )
        .mockResolvedValueOnce(
          createMockResponse(false, 401, { message: 'Refresh token invalid' })
        );

      try {
        await customFetch('/protected-data');
      } catch {
        // 에러 무시
      }

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(window.location.href).toBe('/login');
    });

    it('_retry 플래그가 true일 때는 401 에러가 나도 재시도하지 않아야 한다 (무한 루프 방지)', async () => {
      // 이전에 설정된 mock이 남아있지 않도록 resetAllMocks가 beforeEach에서 수행됨
      fetchMock.mockResolvedValue(
        createMockResponse(false, 401, {
          error: { code: 'ACCESS_TOKEN_EXPIRED' },
        })
      );

      await expect(customFetch('/test', { _retry: true })).rejects.toThrow();

      // 재시도 로직을 타지 않으므로 1번만 호출되어야 함
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('4. 환경별 Base URL 처리', () => {
    it('서버 환경(window undefined)에서는 process.env.INTERNAL_API_URL을 사용해야 한다', async () => {
      vi.stubGlobal('window', undefined);
      vi.stubGlobal('process', {
        env: { INTERNAL_API_URL: 'http://backend:9000' },
      });

      fetchMock.mockResolvedValue(createMockResponse(true, 200, {}));

      await customFetch('/api/server');

      const calledUrl = fetchMock.mock.calls[0][0] as string;
      expect(calledUrl).toBe('http://backend:9000/api/server');
    });
  });
});
