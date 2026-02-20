'use client';

import { useHydrateAtoms } from 'jotai/utils';
import { useSetAtom } from 'jotai'; // 👈 useSetAtom 추가
import { memberAtom, authLoadingAtom } from '@/features/login/model/auth.store';
import type { AuthResponse } from '@/features/login/model/auth.types';
import { ReactNode, useEffect } from 'react'; // 👈 useEffect 추가

interface Props {
  user: AuthResponse | null;
  children: ReactNode;
}

export function AuthInitializer({ user, children }: Props) {
  // 1. [초기화] 서버 사이드 렌더링 시 값 주입 (HTML 생성 시점)
  useHydrateAtoms([
    [memberAtom, user],
    [authLoadingAtom, false],
  ]);

  // 2. [동기화] 클라이언트에서 props(user)가 바뀔 때마다 Atom 업데이트
  const setMember = useSetAtom(memberAtom);
  const setLoading = useSetAtom(authLoadingAtom);

  useEffect(() => {
    // 서버에서 받은 user 데이터가 변경되면(null <-> 데이터), Atom에 즉시 반영
    setMember(user);
    setLoading(false);
  }, [user, setMember, setLoading]);

  return <>{children}</>;
}
