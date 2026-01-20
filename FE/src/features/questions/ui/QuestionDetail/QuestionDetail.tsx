import type { Answer, QuestionDetail } from '@/features/questions/model';
import AnswerCard from '@/features/questions/ui/QuestionDetail/AnswerCard';
import QuestionCard from '@/features/questions/ui/QuestionDetail/QuestionCard';
import QuestionStatus from '@/features/questions/ui/Status/Status';
import BackButton from '@/shared/ui/BackButton';
import { Eye, MessageCircle } from 'lucide-react';

const QuestionDetail = ({
  data, // TODO: 백엔드 API 연결 후 실제 데이터 사용
}: {
  data: { question: QuestionDetail; answers: Answer[] };
}) => {
  return (
    <article className="mx-auto flex w-full max-w-270 flex-col items-start justify-center">
      <BackButton />
      <h1 className="mt-4 text-display-32 text-neutral-text-strong">
        BoostUs 질문 & 답변 제목
      </h1>
      <div className="flex flex-row gap-4 mt-3">
        <QuestionStatus status={false} />
        <div className="flex flex-row items-center justify-center gap-1">
          <MessageCircle
            className="text-neutral-text-weak"
            strokeWidth={2}
            size={14}
          />
          <span className="text-neutral-text-weak text-body-12">{1}</span>
        </div>
        <div className="flex flex-row items-center justify-center gap-1">
          <Eye className="text-neutral-text-weak" strokeWidth={2} size={14} />
          <span className="text-neutral-text-weak text-body-12">{123}</span>
        </div>
      </div>
      <QuestionCard />
      <h2 className="mt-10 text-display-24 text-neutral-text-strong">
        1개의 답변
      </h2>
      <AnswerCard />
    </article>
  );
};

export default QuestionDetail;
