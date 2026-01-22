import type { Answer, QuestionDetail } from '@/features/questions/model';
import AnswerCard from '@/features/questions/ui/QuestionDetail/AnswerCard';
import QuestionCard from '@/features/questions/ui/QuestionDetail/QuestionCard';
import QuestionStatus from '@/features/questions/ui/Status/Status';
import BackButton from '@/shared/ui/BackButton';
import { Eye, MessageCircle } from 'lucide-react';

const QuestionDetail = ({
  data,
}: {
  data: { question: QuestionDetail; answers: Answer[] };
}) => {
  const { question, answers } = data;

  return (
    <article className="mx-auto flex w-full max-w-270 flex-col items-start justify-center">
      <BackButton />
      <h1 className="mt-4 text-display-32 text-neutral-text-strong">
        {question.title}
      </h1>
      <div className="flex flex-row gap-4 mt-3">
        <QuestionStatus status={question.isResolved} />
        <div className="flex flex-row items-center justify-center gap-1">
          <MessageCircle
            className="text-neutral-text-weak"
            strokeWidth={2}
            size={14}
          />
          <span className="text-neutral-text-weak text-body-12">
            {question.answerCount}
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-1">
          <Eye className="text-neutral-text-weak" strokeWidth={2} size={14} />
          <span className="text-neutral-text-weak text-body-12">
            {question.viewCount}
          </span>
        </div>
      </div>
      <QuestionCard question={question} />
      {answers.length > 0 ? (
        <>
          <h2 className="mt-12 text-display-24 text-neutral-text-strong">
            {question.answerCount}개의 답변
          </h2>
          {answers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}
        </>
      ) : (
        <p className="w-full flex items-center justify-center mt-12 text-string-16 text-neutral-text-weak">
          답변이 없습니다.
        </p>
      )}
    </article>
  );
};

export default QuestionDetail;
