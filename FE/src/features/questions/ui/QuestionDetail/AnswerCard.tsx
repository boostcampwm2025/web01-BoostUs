'use client';
import { Answer, Question } from '@/features/questions/model/questions.type';
import VoteButtons from '@/features/questions/ui/QuestionDetail/VoteButtons';
import { CircleCheck } from 'lucide-react';
import {
  likeAnswer,
  dislikeAnswer,
  acceptAnswer,
} from '../../api/questions.api';
import { useAuth } from '@/features/login/model';
import MarkdownViewer from '@/shared/ui/MarkdownViewer';

type Props = {
  answer: Answer;
  question: Question;
};

const AnswerCard = ({ answer, question }: Props) => {
  const { member } = useAuth();
  const isQuestionAuthor = member?.id === question.member.id;
  return (
    <section
      className={`
    mt-6 w-full rounded-2xl border
    ${
      answer.isAccepted
        ? 'border-green-500 bg-green-50'
        : 'border-neutral-border-default bg-neutral-surface-bold'
    }
  `}
    >
      <div className="flex flex-row gap-6 w-full px-4 py-4 rounded-b-2xl">
        <VoteButtons
          answer={answer}
          onDownvote={() => dislikeAnswer(answer.id)}
          onUpvote={() => likeAnswer(answer.id)}
        />
        <div className="flex flex-col justify-between w-full">
          <div className="w-full">
            <MarkdownViewer content={answer.contents} />
          </div>
          <div className="border-t border-neutral-border-default w-full flex flex-row pt-4 justify-between">
            {isQuestionAuthor && (
              <button
                className="gap-1 flex flex-row items-center justify-center text-neutral-text-default cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150"
                onClick={() => acceptAnswer(question.id, answer.id)}
              >
                <CircleCheck size={16} />
                <span>채택하기</span>
              </button>
            )}

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
