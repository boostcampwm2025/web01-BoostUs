const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL ?? 'http://backend:3000';
  }

  return '';
};

export const customFetch = async <T>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  const response = await fetch(url, {
    ...options,
  });

  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

  return response.json() as Promise<T>;
};
