import {
  Answer,
  QuestionDetail,
  Reaction,
} from '@/features/questions/model/questions.type';
import { toast } from '@/shared/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  dislikeAnswer,
  dislikeQuestion,
  likeAnswer,
  likeQuestion,
  QUESTIONS_KEY,
} from '@/features/questions/api/questions.api';

interface QuestionData {
  question: QuestionDetail;
  answers: Answer[];
}

export const useQuestionVote = (questionId: string) => {
  const queryClient = useQueryClient();
  const queryKey = QUESTIONS_KEY.detail(questionId);

  // 헬퍼 함수: 캐시 업데이트 로직
  const updateVoteState = (
    oldData: QuestionData | undefined,
    targetId: string,
    type: 'LIKE' | 'DISLIKE',
    isAnswer: boolean
  ) => {
    if (!oldData) return oldData;

    const target = isAnswer
      ? oldData.answers.find((a) => a.id === targetId)
      : oldData.question;

    if (!target) return oldData;

    // 투표 로직 계산
    let nextUp = target.upCount;
    let nextDown = target.downCount;
    let nextReaction: Reaction = type;
    const currentReaction = target.reaction;

    if (currentReaction === type) {
      // 취소 (Toggle Off)
      nextReaction = 'NONE';
      if (type === 'LIKE') nextUp--;
      if (type === 'DISLIKE') nextDown--;
    } else {
      // 변경 (Switch)
      if (type === 'LIKE') {
        nextUp++;
        if (currentReaction === 'DISLIKE') nextDown--;
      } else {
        nextDown++;
        if (currentReaction === 'LIKE') nextUp--;
      }
    }

    const newTarget = {
      ...target,
      upCount: nextUp,
      downCount: nextDown,
      reaction: nextReaction,
    };

    if (isAnswer) {
      return {
        ...oldData,
        answers: oldData.answers.map((a) =>
          a.id === targetId ? (newTarget as Answer) : a
        ),
      };
    } else {
      return {
        ...oldData,
        question: newTarget as QuestionDetail,
      };
    }
  };

  // 실제 Mutation들 (여기서 캐시 업데이트 로직을 setQueryData에 직접 넣음)
  const voteQuestion = useMutation({
    mutationFn: ({ type }: { type: 'LIKE' | 'DISLIKE' }) =>
      type === 'LIKE' ? likeQuestion(questionId) : dislikeQuestion(questionId),
    onMutate: async ({ type }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<QuestionData>(queryKey);

      queryClient.setQueryData<QuestionData>(queryKey, (old) =>
        updateVoteState(old, questionId, type, false)
      );

      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
      toast.error('투표 실패');
    },
  });

  const voteAnswer = useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'LIKE' | 'DISLIKE' }) =>
      type === 'LIKE' ? likeAnswer(id) : dislikeAnswer(id),
    onMutate: async ({ id, type }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<QuestionData>(queryKey);

      queryClient.setQueryData<QuestionData>(queryKey, (old) =>
        updateVoteState(old, id, type, true)
      );

      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
      toast.error('투표 실패');
    },
  });

  return { voteQuestion, voteAnswer };
};
