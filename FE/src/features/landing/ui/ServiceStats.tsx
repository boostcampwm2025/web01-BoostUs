'use client';

import { useEffect, useState } from 'react';
import { useCountUp } from '@/features/landing/model/useCountup';
import { getLandingCount } from '../api/landing.api';
import { LandingData } from '../model/landing.type';

const ServiceStats = () => {
  const [data, setData] = useState<LandingData | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await getLandingCount();
      setData(res);
    })();
  }, []);

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
