'use client';

import { useState } from 'react';
import type { StoriesRankingPeriods, StoriesRankingPeriodState } from './types';

/**
 * 스토리 랭킹 필터링에 사용할 수 있는 기간 옵션 목록
 * @type {StoriesRankingPeriods[]}
 */
export const RANKING_OPTIONS: StoriesRankingPeriods[] = [
  '전체',
  '이번 달',
  '이번 주',
  '오늘',
];

/**
 * 스토리 랭킹 기간 필터의 상태와 제어 함수를 관리하는 커스텀 훅
 *
 * @returns {StoriesRankingPeriodState} 드롭다운 열기/닫기 상태, 선택된 옵션, 제어 함수를 포함하는 객체
 * @example
 * const { isDropdownOpen, toggleDropdown, selected, selectOption } = useStoriesRankingPeriod();
 */
export const useStoriesRankingPeriod = (): StoriesRankingPeriodState => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<StoriesRankingPeriods>('전체');

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const selectOption = (option: StoriesRankingPeriods) => {
    setSelected(option);
    setIsDropdownOpen(false);
  };

  return {
    isDropdownOpen,
    toggleDropdown,
    selected,
    selectOption,
    options: RANKING_OPTIONS,
  };
};
