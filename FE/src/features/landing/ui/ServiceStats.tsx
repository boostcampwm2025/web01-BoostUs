'use client';

import { useCountUp } from '@/features/landing/model/useCountup';

const ServiceStats = () => {
  // 반복되는 UI를 줄이기 위해 데이터를 배열로 관리
  const stats = [
    { label: '활동 중인 사용자', value: 333 },
    { label: '공유된 프로젝트', value: 373 },
    { label: '나눈 이야기', value: 333 },
  ];

  return (
    <div className="flex flex-row items-center justify-center gap-16 mt-15 mb-20">
      {stats.map((stat, index) => (
        <StatItem key={index} label={stat.label} targetValue={stat.value} />
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
