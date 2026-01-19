import { fetchQuestions } from '@/features/questions/api/questions.api';
import QuestionsPageContent from '@/features/questions/ui/QuestionsPageContent';

const QuestionsPage = async () => {
  const response = await fetchQuestions();
  const initialQuestions = response.data.items;
  return <QuestionsPageContent initialQuestions={initialQuestions} />;
};

export default QuestionsPage;
