'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/features/login/model/auth.store';

/**
 * 앱 실행 시 최초 1회 사용자 인증 상태를 확인하는 컴포넌트
 * 화면에 아무것도 그리지 않습니다 (null 반환)
 */
export function AuthInitializer() {
  const { fetchCurrentMember } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    // React.StrictMode 등에서 두 번 실행되는 것을 방지하기 위한 체크
    if (!initialized.current) {
      fetchCurrentMember();
      initialized.current = true;
    }
  }, [fetchCurrentMember]);

  return null;
}
