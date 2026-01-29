import { getQuestionById } from '@/features/questions/api/questions.api';
import QuestionDetail from '@/features/questions/ui/QuestionDetail/QuestionDetail';

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}

const QuestionsDetailPage = async ({ params }: Props) => {
  const { questionId } = await params;

  const response = await getQuestionById(questionId);
  const question = response?.question;
  const answers = response?.answers;

  const data = { question, answers: answers || [] };
  return <QuestionDetail data={data} />;
};

export default QuestionsDetailPage;
