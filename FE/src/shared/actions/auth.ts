'use server';

import { cookies } from 'next/headers';
import type { AuthResponse } from '@/features/login/model/auth.types';

export async function getMeAction(): Promise<AuthResponse | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  const BASE_URL = process.env.INTERNAL_API_URL ?? 'http://127.0.0.1:3000';

  try {
    const res = await fetch(`${BASE_URL}/api/members/me/profile`, {
      method: 'GET',
      headers: {
        'x-proxied-by': 'next',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const result = (await res.json()) as { data: AuthResponse };
    return result.data;
  } catch (e) {
    console.error('❌ fetch 실패:', e);
    return null;
  }
}
