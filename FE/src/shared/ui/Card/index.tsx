import Link from 'next/link';
import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// 1. 카드 전체 껍데기 (Link 기반)
// Flex나 Grid 레이아웃은 사용하는 쪽에서 className으로 주입합니다.
const Root = ({
  className,
  children,
  href,
  ...props
}: ComponentProps<typeof Link>) => {
  return (
    <Link
      href={href}
      className={cn(
        // 공통 프레임 스타일
        'group block w-full h-full overflow-hidden rounded-2xl bg-neutral-surface-bold',
        'border border-neutral-border-default transition-colors duration-150',
        'hover:border-neutral-border-active hover:shadow-hover shadow-default',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

// 2. 이미지 영역 컨테이너
// aspect-ratio나 height 관련 설정은 사용하는 쪽에서 className으로 주입합니다.
const ImageContainer = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('relative w-full overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// 3. 텍스트 컨텐츠 영역
const Content = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {children}
    </div>
  );
};

// 4. 제목 (Typography)
const Title = ({ className, children, ...props }: ComponentProps<'h3'>) => {
  return (
    <h3
      className={cn(
        'text-neutral-text-strong font-bold line-clamp-1',
        // 기본 사이즈는 display-16, 필요시 display-20 등으로 덮어쓰기 가능
        'text-display-16',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

// 5. 본문/설명 (Typography)
const Description = ({
  className,
  children,
  ...props
}: ComponentProps<'p'>) => {
  return (
    <p
      className={cn('text-body-14 text-neutral-text-weak', className)}
      {...props}
    >
      {children}
    </p>
  );
};

// 6. 하단 정보 영역 (Footer)
const Footer = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('flex flex-row items-center gap-2 mt-auto', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Compound Component 구성
export const Card = {
  Root,
  ImageContainer,
  Content,
  Title,
  Description,
  Footer,
};
