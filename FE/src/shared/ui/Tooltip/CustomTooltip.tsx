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
  asChild?: boolean; // Trigger에 asChild를 사용할지 여부 (기본값 true)
}

const CustomTooltip = ({
  content,
  children,
  side = 'top',
  contentClassName,
  asChild = true,
}: CustomTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent side={side} className={contentClassName}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
