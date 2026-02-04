import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  acceptAnswer,
  QUESTIONS_KEY,
} from '@/features/questions/api/questions.api';
import { toast } from '@/shared/utils/toast';
import { revalidateMultiplePageCaches } from '@/shared/actions/revalidate';
import { QuestionDetail, Answer } from './questions.type';

export const useAcceptAnswerMutation = (questionId: string) => {
  const queryClient = useQueryClient();
  const queryKey = QUESTIONS_KEY.detail(questionId);

  return useMutation({
    mutationFn: (answerId: string) => acceptAnswer(questionId, answerId),

    // 1. 낙관적 업데이트 시작
    onMutate: async (answerId) => {
      // 진행 중인 쿼리 취소 (충돌 방지)
      await queryClient.cancelQueries({ queryKey });

      // 이전 데이터 스냅샷 저장 (에러 시 롤백용)
      const previousData = queryClient.getQueryData<{
        question: QuestionDetail;
        answers: Answer[];
      }>(queryKey);

      // 캐시 강제 수정 (UI 즉시 반영)
      queryClient.setQueryData<{
        question: QuestionDetail;
        answers: Answer[];
      }>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          question: {
            ...old.question,
            isResolved: true, // 질문도 '해결됨' 상태로 변경
          },
          answers: old.answers.map((ans) =>
            ans.id === answerId ? { ...ans, isAccepted: true } : ans
          ),
        };
      });

      return { previousData };
    },

    // 2. 에러 발생 시 롤백
    onError: (err, newTodo, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error(err);
    },

    // 3. 성공/실패 여부와 상관없이 최신화
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });

      await revalidateMultiplePageCaches([
        '/questions',
        `/questions/${questionId}`,
      ]);

      toast.success('답변이 채택되었습니다.');
    },
  });
};
