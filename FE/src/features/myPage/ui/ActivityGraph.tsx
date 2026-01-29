'use client';

import React from 'react';
import { ActivityCalendar, Activity } from 'react-activity-calendar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'; // Shadcn Tooltip 경로 확인
import { generateMockData } from '@/features/myPage/utils/mock-data';
import { CircleHelpIcon } from '@/components/ui/circle-help';
import CustomTooltip from '@/shared/ui/Tooltip/CustomTooltip';

const TOOLTIP_CONTENT =
  '최근 1년 간의 활동을 보여주는 그래프로, 각 칸은 하루를 나타냅니다. 칸의 색깔은 그 날의 활동량을 나타내며, 색이 진할수록 활동량이 많음을 의미합니다. 활동량은 질문 & 답변 작성, 좋아요 등 다양한 활동을 포함합니다.';

export default function ActivityGraph() {
  const data = generateMockData();

  // level 0 (빈칸) ~ level 4 (진한색)
  const theme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  return (
    <div className="w-full p-6 bg-neutral-surface-bold rounded-xl border border-neutral-border-default">
      <div className="mb-4 flex items-center gap-1 text-neutral-text-week">
        {/* 설명 */}
        <h3 className="text-display-20 text-neutral-text-strong">
          활동 그래프
        </h3>
        <CircleHelpIcon
          size={16}
          className="text-neutral-text-weak cursor-pointer transition-colors hover:text-neutral-text-strong duration-150"
        />
        {/* TODO: CustomTooltip으로 감싸기, CustomTooltip을 그냥 사용하니 아래 ActivityCalendar에서 무한 리렌더링 오류 발생 */}
      </div>

      <div className="flex justify-center">
        <TooltipProvider delayDuration={0}>
          <ActivityCalendar
            colorScheme="light"
            data={data}
            theme={theme}
            blockSize={12} // 박스 크기
            blockRadius={2} // 박스 둥글기
            blockMargin={4} // 박스 간 간격
            fontSize={12} // 폰트 크기
            // 한글 월/요일 표시 설정
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
              legend: {
                less: '적음',
                more: '많음',
              },
            }}
            // Shadcn Tooltip 적용
            renderBlock={(block, activity) => (
              <Tooltip>
                <TooltipTrigger asChild>{block}</TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p className="font-semibold">{activity.date}</p>
                    <p>활동: {activity.count}회</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          />
        </TooltipProvider>
      </div>
    </div>
  );
}
