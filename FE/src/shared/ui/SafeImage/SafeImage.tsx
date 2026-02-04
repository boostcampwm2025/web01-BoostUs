'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { OPTIMIZED_IMAGE_DOMAINS } from '@/shared/constants/image-domains';

const DEFAULT_THUMBNAIL = '/assets/NoImage.png';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'priority'> {
  src?: string | null;
  fallbackSrc?: string;
  priority?: boolean;
}

// 1. 내부 로직을 담당하는 컴포넌트 (상태 관리)
const InnerSafeImage = ({
  src,
  fallbackSrc = DEFAULT_THUMBNAIL,
  alt,
  fill,
  priority = false,
  loading,
  ...props
}: SafeImageProps) => {
  const [isError, setIsError] = useState(false);

  // 렌더링할 최종 소스 결정
  const currentSrc = isError ? fallbackSrc : (src ?? fallbackSrc);

  const handleError = () => {
    if (!isError) setIsError(true);
  };

  // 도메인 체크 로직
  const isOptimizable = (url: string) => {
    try {
      if (!url.startsWith('http')) return true;
      const hostname = new URL(url).hostname;
      return OPTIMIZED_IMAGE_DOMAINS.some((domain) =>
        hostname.endsWith(domain)
      );
    } catch {
      return false;
    }
  };

  // Case A: Next/Image 사용 (최적화 가능 도메인)
  if (isOptimizable(currentSrc)) {
    return (
      <Image
        src={currentSrc}
        alt={alt || '이미지'}
        fill={fill}
        priority={priority}
        loading={priority ? undefined : loading}
        onError={handleError}
        {...props}
      />
    );
  }

  // Case B: 일반 img 태그 사용 (미허용 도메인)
  return (
    <img
      src={currentSrc}
      alt={alt || '이미지'}
      onError={handleError}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : (loading ?? 'lazy')}
      className={props.className}
      style={
        fill
          ? {
              position: 'absolute',
              height: '100%',
              width: '100%',
              inset: 0,
              objectFit: 'cover',
            }
          : {
              width: props.width,
              height: props.height,
            }
      }
    />
  );
};

const SafeImage = (props: SafeImageProps) => {
  return <InnerSafeImage key={props.src ?? 'empty'} {...props} />;
};

export default SafeImage;
