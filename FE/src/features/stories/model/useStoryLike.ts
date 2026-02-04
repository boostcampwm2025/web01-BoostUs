import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/utils/toast';
import { StoryDetail } from '../model/stories.type';
import {
  likeStory,
  STORIES_KEY,
  unlikeStory,
} from '@/features/stories/api/stories.api';

export const useStoryLike = (storyId: string) => {
  const queryClient = useQueryClient();
  const detailKey = STORIES_KEY.detail(storyId);
  const statusKey = STORIES_KEY.likeStatus(storyId);

  const { mutate: toggleLike } = useMutation({
    mutationFn: (isLiked: boolean) =>
      isLiked ? unlikeStory(storyId) : likeStory(storyId),

    onMutate: async (currentIsLiked) => {
      // 1. 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: statusKey });

      // 2. 이전 상태 스냅샷 (롤백용)
      const prevDetail = queryClient.getQueryData<StoryDetail>(detailKey);
      const prevStatus = queryClient.getQueryData<boolean>(statusKey);

      // 3. 낙관적 업데이트 적용
      // 3-1. 좋아요 상태 (Boolean) 반전
      queryClient.setQueryData(statusKey, !currentIsLiked);

      // 3-2. 좋아요 개수 (Count) 조정
      if (prevDetail) {
        queryClient.setQueryData<StoryDetail>(detailKey, {
          ...prevDetail,
          likeCount: currentIsLiked
            ? Math.max(prevDetail.likeCount - 1, 0) // 취소 시 감소
            : prevDetail.likeCount + 1, // 등록 시 증가
        });
      }

      return { prevDetail, prevStatus };
    },

    onError: (err, __, context) => {
      // 4. 에러 발생 시 롤백
      if (context?.prevDetail) {
        queryClient.setQueryData(detailKey, context.prevDetail);
      }
      if (context?.prevStatus !== undefined) {
        queryClient.setQueryData(statusKey, context.prevStatus);
      }
      toast.error('좋아요 처리에 실패했습니다.');
    },

    onSettled: () => {
      // 5. 서버 데이터와 동기화 (선택 사항)
      void queryClient.invalidateQueries({ queryKey: detailKey });
      void queryClient.invalidateQueries({ queryKey: statusKey });
    },
  });

  return { toggleLike };
};
