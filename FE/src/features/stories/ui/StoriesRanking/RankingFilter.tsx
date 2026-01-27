'use client';

import { useStoriesContext } from '@/features/stories/model';
import SlidingFilter from '@/widgets/SlidingFilter';

const FILTER_OPTIONS = [
  { key: 'daily', label: '오늘' },
  { key: 'weekly', label: '주간' },
  { key: 'monthly', label: '월간' },
  { key: 'all', label: '전체' },
] as const;

const RankingFilter = () => {
  const { rankingPeriod, setRankingPeriod } = useStoriesContext();

  const currentSelection = FILTER_OPTIONS.some(
    (opt) => opt.key === rankingPeriod
  )
    ? rankingPeriod
    : 'all';

  return (
    <SlidingFilter
      options={FILTER_OPTIONS}
      value={currentSelection}
      onChange={setRankingPeriod}
      layoutId="ranking-filter-pill"
      className="h-10"
    />
  );
};

export default RankingFilter;
