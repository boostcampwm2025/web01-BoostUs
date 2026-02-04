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

const InnerSafeImage = ({
  src,
  fallbackSrc = DEFAULT_THUMBNAIL,
  alt,
  fill,
  priority = false,
  loading,
  className,
  style,
  ...rest // 나머지 모든 props (onClick, aria-*, 등)
}: SafeImageProps) => {
  const [isError, setIsError] = useState(false);

  const currentSrc = isError ? fallbackSrc : (src ?? fallbackSrc);

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

  const handleError = () => {
    if (!isError) setIsError(true);
  };

  // 공통 속성 정리
  const commonProps = {
    src: currentSrc,
    alt,
    onError: handleError,
    className,
    ...rest,
  };

  // Case A: Next/Image 사용
  if (isOptimizable(currentSrc)) {
    return (
      <Image
        {...commonProps}
        fill={fill}
        priority={priority}
        loading={priority ? undefined : loading}
      />
    );
  }

  // Case B: 일반 img 태그 사용
  return (
    <img
      {...commonProps}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : (loading ?? 'lazy')}
      style={
        fill
          ? {
              position: 'absolute',
              height: '100%',
              width: '100%',
              inset: 0,
              objectFit: 'cover',
              ...style,
            }
          : {
              width: rest.width,
              height: rest.height,
              ...style,
            }
      }
      alt={alt || '이미지'}
    />
  );
};

const SafeImage = (props: SafeImageProps) => {
  return <InnerSafeImage key={props.src ?? 'empty'} {...props} />;
};

export default SafeImage;
