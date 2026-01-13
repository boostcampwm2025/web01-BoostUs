'use client';

import {
  StoriesRankingPeriods,
  StoriesRankingPeriodState,
} from '@/features/stories/model/types';
import { useState } from 'react';

/**
 * 스토리 랭킹 필터링에 사용할 수 있는 기간 옵션 목록
 * @type {StoriesRankingPeriods[]}
 */
export const RANKING_OPTIONS: StoriesRankingPeriods[] = [
  '오늘',
  '주간',
  '월간',
  '전체',
];

/**
 * 스토리 랭킹 기간 필터의 상태와 제어 함수를 관리하는 커스텀 훅
 *
 * @returns {StoriesRankingPeriodState} 선택된 옵션, 제어 함수를 포함하는 객체
 * @example
 * const { selected, selectOption, options } = useStoriesRankingPeriod();
 */
export const useStoriesRankingPeriod = (): StoriesRankingPeriodState => {
  const [selected, setSelected] = useState<StoriesRankingPeriods>('전체');

  const selectOption = (option: StoriesRankingPeriods) => {
    setSelected(option);
  };

  return {
    selected,
    selectOption,
    options: RANKING_OPTIONS,
  };
};
