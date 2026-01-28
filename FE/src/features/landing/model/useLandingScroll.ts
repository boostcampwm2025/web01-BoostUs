'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface UseLandingScrollReturn {
  firstSectionRef: React.RefObject<HTMLDivElement | null>;
  secondSectionRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 랜딩 페이지에서 첫 번째 섹션에서 스크롤 또는 특정 키 입력 시
 * 두 번째 섹션으로 부드럽게 스크롤하는 훅
 */
export const useLandingScroll = (): UseLandingScrollReturn => {
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  const scrollToSecondSection = useCallback(() => {
    hasScrolledRef.current = true;
    secondSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    if (hasScrolledRef.current) return;

    const firstSection = firstSectionRef.current;
    if (!firstSection) return;

    const rect = firstSection.getBoundingClientRect();
    // 첫 번째 섹션이 화면에 완전히 보이지 않으면 이미 스크롤된 것
    if (rect.bottom <= 0) {
      hasScrolledRef.current = true;
      return;
    }

    // 스크롤 감지 시 두 번째 섹션으로 이동
    if (window.scrollY > 0) {
      scrollToSecondSection();
    }
  }, [scrollToSecondSection]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (hasScrolledRef.current) return;

      // 스페이스, 아래 화살표, Page Down 키
      if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToSecondSection();
      }
    },
    [scrollToSecondSection]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleScroll, handleKeyDown]);

  useEffect(() => {
    const chevron = document.getElementById('scroll-chevron');
    chevron?.addEventListener('click', scrollToSecondSection);

    return () => {
      chevron?.removeEventListener('click', scrollToSecondSection);
    };
  }, [scrollToSecondSection]);

  return {
    firstSectionRef,
    secondSectionRef,
  };
};
