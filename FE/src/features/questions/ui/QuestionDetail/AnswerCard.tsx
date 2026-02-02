'use client';

import { Answer, Question } from '@/features/questions/model/questions.type';
import VoteButtons from '@/features/questions/ui/QuestionDetail/VoteButtons';
import { CircleCheck } from 'lucide-react';
import {
  likeAnswer,
  dislikeAnswer,
  acceptAnswer,
} from '../../api/questions.api';
import { useAuth } from '@/features/login/model/auth.store';
import MarkdownViewer from '@/shared/ui/MarkdownViewer';
import CardHeader from './CardHeader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useOptimisticVote } from '@/features/questions/model/useOptimisticVote';
import CustomTooltip from '@/shared/ui/Tooltip/CustomTooltip';

interface Props {
  answer: Answer;
  question: Question;
  hasAcceptedAnswer: boolean;
}

const TOOLTIP_MESSAGE = '답변을 채택하면 수정이나 삭제가 불가능해요';

const AnswerCard = ({ answer, question, hasAcceptedAnswer }: Props) => {
  const { member } = useAuth();
  const router = useRouter();

  const { stats, myVote, handleVote } = useOptimisticVote({
    id: answer.id,
    initialStats: {
      upCount: answer.upCount,
      downCount: answer.downCount,
    },
    api: {
      voteUp: likeAnswer,
      voteDown: dislikeAnswer,
    },
  });

  const [isAccepted, setIsAccepted] = useState(answer.isAccepted);

  useEffect(() => {
    if (answer.isAccepted !== isAccepted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAccepted(answer.isAccepted);
    }
  }, [answer.isAccepted, isAccepted]);

  const isQuestionAuthor = member?.member?.id === question.member.id;
  const isMyAnswer = member?.member?.id === answer.member.id;
  const showAcceptButton =
    isQuestionAuthor && !question.isResolved && !isAccepted && !isMyAnswer;

  const handleAccept = async () => {
    if (question.isResolved) return;

    const previousState = isAccepted; // 롤백용 이전 상태 저장
    setIsAccepted(true);

    try {
      await acceptAnswer(question.id, answer.id);

      router.refresh();
    } catch (error) {
      console.error('Error accepting answer:', error);
      setIsAccepted(previousState);
      alert('답변 채택에 실패했습니다.');
    }
  };

  return (
    <section
      className={`
    mt-6 w-full rounded-2xl border
    ${
      isAccepted
        ? 'border-green-500 bg-green-50'
        : 'border-neutral-border-default bg-neutral-surface-bold'
    }
  `}
    >
      <CardHeader answer={answer} hasAcceptedAnswer={hasAcceptedAnswer} />

      <div className="flex flex-row gap-6 w-full px-4 py-4 rounded-b-2xl">
        <VoteButtons
          upCount={stats.upCount}
          myVote={myVote}
          onUpvote={() => handleVote('up')}
          onDownvote={() => handleVote('down')}
        />
        <div className="flex flex-col justify-between w-full">
          <div className="w-full">
            <MarkdownViewer content={answer.contents} />
          </div>
          <div className="border-t border-neutral-border-default w-full flex flex-row pt-4 justify-between">
            <CustomTooltip
              content={TOOLTIP_MESSAGE}
              contentClassName="bg-brand-surface-default text-brand-text-on-default"
            >
              <button
                className={`gap-1 flex flex-row items-center justify-center text-neutral-text-default cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150 ${
                  showAcceptButton ? 'visible' : 'invisible pointer-events-none'
                }`}
                onClick={handleAccept}
                aria-hidden={!showAcceptButton}
                disabled={!showAcceptButton}
              >
                <CircleCheck size={16} />
                <span>채택하기</span>
              </button>
            </CustomTooltip>

            <div className="flex flex-row items-center justify-center gap-2">
              <button className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150">
                공유
              </button>
              <button className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150">
                신고
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnswerCard;
