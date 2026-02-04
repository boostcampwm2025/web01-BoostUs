import {
  getQuestionById,
  QUESTIONS_KEY,
} from '@/features/questions/api/questions.api';
import QuestionDetail from '@/features/questions/ui/QuestionDetail/QuestionDetail';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}

const QuestionsDetailPage = async ({ params }: Props) => {
  const { questionId } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUESTIONS_KEY.detail(questionId),
    queryFn: () => getQuestionById(questionId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionDetail questionId={questionId} />
    </HydrationBoundary>
  );
};

export default QuestionsDetailPage;
