type QueryParamValue = string | number | boolean | undefined | null;

type FetchOptions = RequestInit & {
  params?: Record<string, QueryParamValue>;
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
  const { params, ...fetchOptions } = options ?? {};
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

  if (!response.ok)
    throw new Error(
      `API Error: ${response.statusText} (${response.status.toString()})`
    );

  return (await response.json()) as T;
};
