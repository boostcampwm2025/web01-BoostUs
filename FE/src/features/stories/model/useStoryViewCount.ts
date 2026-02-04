import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  incrementStoryView,
  STORIES_KEY,
} from '@/features/stories/api/stories.api';

export const useStoryViewCount = (storyId: string) => {
  const queryClient = useQueryClient();
  const isViewed = useRef(false);

  const { mutate } = useMutation({
    mutationFn: incrementStoryView,
    onSuccess: () => {
      // 조회수 증가 성공 -> 상세 데이터(viewCount 포함) 갱신
      void queryClient.invalidateQueries({
        queryKey: STORIES_KEY.detail(storyId),
      });
    },
    onError: (error) => {
      console.error('Story view count failed', error);
    },
  });

  useEffect(() => {
    if (storyId && !isViewed.current) {
      isViewed.current = true;
      mutate(storyId);
    }
  }, [storyId, mutate]);
};
