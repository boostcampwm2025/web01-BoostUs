'use client';

import { useState } from 'react';
import type { StoriesRankingPeriod } from './types';

export const RANKING_OPTIONS: StoriesRankingPeriod[] = [
  '전체',
  '이번 달',
  '이번 주',
  '오늘',
];

export const useStoriesRanking = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<StoriesRankingPeriod>('전체');

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: StoriesRankingPeriod) => {
    setSelected(option);
    setIsOpen(false);
  };

  return {
    isOpen,
    selected,
    toggleDropdown,
    selectOption,
    options: RANKING_OPTIONS,
  };
};
