import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  incrementQuestionView,
  QUESTIONS_KEY,
} from '@/features/questions/api/questions.api';

export const useViewCount = (questionId: string) => {
  const queryClient = useQueryClient();
  const isViewed = useRef(false);

  const { mutate } = useMutation({
    mutationFn: incrementQuestionView,
    onSuccess: () => {
      // 조회수 증가 성공 시 -> 질문 상세 데이터 무효화 -> 자동 refetch -> 최신 조회수 반영
      void queryClient.invalidateQueries({
        queryKey: QUESTIONS_KEY.detail(questionId),
      });
    },
    onError: () => {
      // 조회수 증가는 실패해도 치명적이지 않으므로 에러 무시
    },
  });

  useEffect(() => {
    if (questionId && !isViewed.current) {
      isViewed.current = true;
      mutate(questionId);
    }
  }, [questionId, mutate]);
};
