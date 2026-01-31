'use client';

import React, { useMemo } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { generateMockData } from '@/features/myPage/utils/mock-data';
import { CircleHelpIcon } from '@/components/ui/circle-help';
import CustomTooltip from '@/shared/ui/Tooltip/CustomTooltip';
import { TooltipProvider } from '@/components/ui/tooltip';

const TOOLTIP_CONTENT =
  '최근 1년 간의 활동을 보여주는 그래프로, 각 칸은 하루를 나타냅니다. 칸의 색깔은 그 날의 활동량을 나타내며, 색이 진할수록 활동량이 많음을 의미합니다.';

function GraphContent() {
  // 데이터 생성 함수가 렌더링마다 실행되지 않도록 useMemo로 캐싱
  const data = useMemo(() => generateMockData(), []);

  const theme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  return (
    <div className="w-full p-6 bg-neutral-surface-bold rounded-xl border border-neutral-border-default">
      <div className="mb-4 flex items-center gap-1 text-neutral-text-week">
        <h3 className="text-display-20 text-neutral-text-strong">
          활동 그래프
        </h3>

        <CustomTooltip
          content={TOOLTIP_CONTENT}
          contentClassName="bg-brand-surface-default text-brand-text-on-default max-w-[180px] break-keep"
          useProvider={false} // 이미 부모(ActivityGraph)에서 감쌌으므로 false
        >
          {/* [핵심 3] 아이콘을 button이나 div로 감싸야 ref 에러가 안 납니다 */}
          <button type="button" className="flex items-center justify-center">
            <CircleHelpIcon
              size={16}
              className="text-neutral-text-weak cursor-pointer transition-colors hover:text-neutral-text-strong duration-150"
            />
          </button>
        </CustomTooltip>
      </div>

      <div className="flex justify-center">
        <ActivityCalendar
          colorScheme="light"
          data={data}
          theme={theme}
          blockSize={12}
          blockRadius={2}
          blockMargin={4}
          fontSize={12}
          labels={{
            months: [
              '1월',
              '2월',
              '3월',
              '4월',
              '5월',
              '6월',
              '7월',
              '8월',
              '9월',
              '10월',
              '11월',
              '12월',
            ],
            weekdays: ['일', '월', '화', '수', '목', '금', '토'],
            totalCount: '{{count}}개의 활동',
            legend: { less: '적음', more: '많음' },
          }}
          renderBlock={(block, activity) => (
            <CustomTooltip
              key={activity.date}
              useProvider={false} // 여기도 Provider 중복 생성 방지
              contentClassName="bg-brand-surface-default text-brand-text-on-default"
              content={
                <div className="text-xs">
                  <p className="font-semibold">{activity.date}</p>
                  <p>활동: {activity.count}회</p>
                </div>
              }
            >
              {block}
            </CustomTooltip>
          )}
        />
      </div>
    </div>
  );
}

// Provider를 관리하는 껍데기 컴포넌트
export default function ActivityGraph() {
  return (
    // Provider는 여기서 딱 한 번만 선언되고, 절대 리렌더링되지 않음
    <TooltipProvider delayDuration={200}>
      <GraphContent />
    </TooltipProvider>
  );
}
