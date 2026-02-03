'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ReactNode } from 'react';

interface CustomTooltipProps {
  content: ReactNode; // 툴팁에 띄울 내용
  children: ReactNode; // 툴팁을 작동시킬 트리거 요소 (버튼 등)
  side?: 'top' | 'bottom' | 'left' | 'right';
  contentClassName?: string;
  useProvider?: boolean;
  asChild?: boolean; // Trigger에 asChild를 사용할지 여부 (기본값 true)
}

const CustomTooltip = ({
  content,
  children,
  side = 'top',
  contentClassName,
  asChild = true,
  useProvider = true, // 기본값은 true로 둬서 기존 코드들이 안 깨지게 함
}: CustomTooltipProps) => {
  const tooltipElement = (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent side={side} className={contentClassName}>
        {content}
      </TooltipContent>
    </Tooltip>
  );

  // useProvider가 true일 때만 감싸줌
  if (useProvider) {
    return <TooltipProvider>{tooltipElement}</TooltipProvider>;
  }

  return tooltipElement;
};

export default CustomTooltip;
