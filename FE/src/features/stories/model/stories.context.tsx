'use client';

import { JSX, ReactNode } from 'react';
import {
  StoriesUIProvider,
  useStoriesUIContext,
  type StoriesUIContextType,
} from '@/features/stories/model/stories.ui.context';
import {
  StoriesFilterProvider,
  useStoriesFilterContext,
  type StoriesFilterContextType,
} from '@/features/stories/model/stories.filter.context';

/**
 * Stories 페이지 전체 상태를 제공하는 통합 Provider.
 * UI 상태(StoriesUIContext)와 필터 상태(StoriesFilterContext)를 함께 제공한다.
 */
export const StoriesProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => (
  <StoriesUIProvider>
    <StoriesFilterProvider>{children}</StoriesFilterProvider>
  </StoriesUIProvider>
);

/**
 * UI + 필터 Context를 합쳐 반환하는 통합 훅.
 * 기존 소비처 코드를 그대로 유지하기 위한 하위 호환 인터페이스.
 * 특정 값만 필요하다면 useStoriesUIContext / useStoriesFilterContext를 직접 사용한다.
 */
export const useStoriesContext = (): StoriesUIContextType &
  StoriesFilterContextType => ({
  ...useStoriesUIContext(),
  ...useStoriesFilterContext(),
});
