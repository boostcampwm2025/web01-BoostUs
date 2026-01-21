import { getInitialQuestions } from '@/features/questions/api/questions.api';
import QuestionsPageContent from '@/features/questions/ui/QuestionsPageContent';

const QuestionsPage = async () => {
  const response = await getInitialQuestions();
  const initialQuestions = response.data.items ?? [];
  const meta = response.data.meta ?? {
    size: 10,
    nextCursor: null,
    prevCursor: null,
    hasNext: false,
  };

  return (
    <QuestionsPageContent initialQuestions={initialQuestions} meta={meta} />
  );
};

export default QuestionsPage;
