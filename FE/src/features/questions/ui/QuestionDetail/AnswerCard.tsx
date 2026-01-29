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

interface Props {
  answer: Answer;
  question: Question;
}

const AnswerCard = ({ answer, question }: Props) => {
  const { member } = useAuth();
  const router = useRouter();

  const [isAccepted, setIsAccepted] = useState(answer.isAccepted);

  useEffect(() => {
    if (answer.isAccepted !== isAccepted) {
      setIsAccepted(answer.isAccepted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer.isAccepted]);

  const isQuestionAuthor = member?.member?.id === question.member.id;

  const showAcceptButton =
    isQuestionAuthor && !question.isResolved && !isAccepted;

  const handleUpvote = async () => {
    try {
      await likeAnswer(answer.id);
      router.refresh(); /* TODO: 낙관적 업데이트로 개선 필요 */
    } catch (error) {
      console.error('Error upvoting answer:', error);
    }
  };

  const handleDownvote = async () => {
    try {
      await dislikeAnswer(answer.id);
      router.refresh(); /* TODO: 낙관적 업데이트로 개선 필요 */
    } catch (error) {
      console.error('Error downvoting answer:', error);
    }
  };

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
      <CardHeader answer={answer} />

      <div className="flex flex-row gap-6 w-full px-4 py-4 rounded-b-2xl">
        <VoteButtons
          answer={answer}
          onDownvote={handleDownvote}
          onUpvote={handleUpvote}
        />
        <div className="flex flex-col justify-between w-full">
          <div className="w-full">
            <MarkdownViewer content={answer.contents} />
          </div>
          <div className="border-t border-neutral-border-default w-full flex flex-row pt-4 justify-between">
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
