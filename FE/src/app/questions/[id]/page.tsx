import { getQuestionById } from '@/features/questions/api/questions.api';
import QuestionDetail from '@/features/questions/ui/QuestionDetail/QuestionDetail';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const QuestionsDetailPage = async ({ params }: Props) => {
  const { id } = await params;

  const response = await getQuestionById(id);
  const question = response?.question;
  const answers = response?.answers;

  const data = { question, answers: answers || [] };
  return <QuestionDetail data={data} />;
};

export default QuestionsDetailPage;
