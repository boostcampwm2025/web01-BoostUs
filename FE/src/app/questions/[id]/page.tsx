import { getQuestionById } from '@/features/questions/api/questions.api';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const QuestionsDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const response = await getQuestionById(id);
  const question = response.data;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">질문 상세 페이지</h1>
      <p>현재 보고 있는 질문 {question.title}</p>
    </div>
  );
};

export default QuestionsDetailPage;
