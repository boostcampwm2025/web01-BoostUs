'use client';

import { useState } from 'react';
import type { StoriesRankingPeriods, StoriesRankingPeriodState } from './types';

export const RANKING_OPTIONS: StoriesRankingPeriods[] = [
  '전체',
  '이번 달',
  '이번 주',
  '오늘',
];

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
