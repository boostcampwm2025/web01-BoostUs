import { fetchQuestions } from '@/features/questions/api/questions.api';
import QuestionsPageContent from '@/features/questions/ui/QuestionsPageContent';

const QuestionsPage = async () => {
  const response = await fetchQuestions();
  const initialQuestions = response.data.items;
  const meta = response.data.meta;
  return (
    <QuestionsPageContent initialQuestions={initialQuestions} meta={meta} />
  );
};

export default QuestionsPage;
