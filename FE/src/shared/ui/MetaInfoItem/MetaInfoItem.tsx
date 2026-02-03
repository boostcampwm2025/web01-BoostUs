import React, { ComponentProps, ElementType } from 'react';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';

interface MetaInfoItemProps extends ComponentProps<'div'> {
  icon: ElementType<LucideProps>;
  children: React.ReactNode;
  iconClassName?: string;
  textClassName?: string;
}

export const MetaInfoItem = ({
  icon: Icon,
  children,
  className,
  iconClassName,
  textClassName,
  ...props
}: MetaInfoItemProps) => {
  return (
    <div
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    >
      <Icon
        className={cn('text-neutral-text-weak h-3 w-3', iconClassName)}
        strokeWidth={2}
      />
      <span
        className={cn('text-body-12 text-neutral-text-weak', textClassName)}
      >
        {children}
      </span>
    </div>
  );
};
