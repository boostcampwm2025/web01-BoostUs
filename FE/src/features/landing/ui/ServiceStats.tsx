'use client';

import { useCountUp } from '@/features/landing/model/useCountup';
import { useQuery } from '@tanstack/react-query';
import {
  getLandingCount,
  LANDING_STATS_KEY,
} from '@/features/landing/api/landing.api';

const ServiceStats = () => {
  const { data } = useQuery({
    queryKey: LANDING_STATS_KEY,
    queryFn: () => getLandingCount(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });

  if (!data) return null; // or skeleton

  const stats = [
    { label: '활동 중인 사용자', value: data.memberCnt },
    { label: '공유된 프로젝트', value: data.projectCnt },
    { label: '나눈 이야기', value: data.storyCnt },
  ];

  return (
    <div className="flex flex-row items-center justify-center gap-16 mt-15 mb-20">
      {stats.map((stat) => (
        <StatItem
          key={stat.label}
          label={stat.label}
          targetValue={stat.value}
        />
      ))}
    </div>
  );
};

const StatItem = ({
  label,
  targetValue,
}: {
  label: string;
  targetValue: number;
}) => {
  const count = useCountUp(targetValue);

  return (
    <div className="gap-2 flex flex-col items-center justify-center">
      <span className="text-string-20 text-brand-text-default">{count}</span>
      <span className="text-body-16 text-neutral-text-weak">{label}</span>
    </div>
  );
};

export default ServiceStats;
