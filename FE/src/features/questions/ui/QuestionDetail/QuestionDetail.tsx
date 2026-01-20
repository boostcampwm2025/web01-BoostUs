import type { Answer, QuestionDetail } from '@/features/questions/model';
import BackButton from '@/shared/ui/BackButton';

const QuestionDetail = ({
  data,
}: {
  data: { question: QuestionDetail; answers: Answer[] };
}) => {
  return (
    <article className="mx-auto flex w-full max-w-270 flex-col items-start justify-center">
      <BackButton />
    </article>
  );
};

export default QuestionDetail;
