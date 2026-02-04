import {
  getInitialQuestions,
  getQuestionById,
  QUESTIONS_KEY,
} from '@/features/questions/api/questions.api';
import QuestionDetail from '@/features/questions/ui/QuestionDetail/QuestionDetail';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export const revalidate = 300;

// Build-time ISR: 최신 질문 10개를 빌드 시점에 미리 생성
export async function generateStaticParams() {
  try {
    const response = await getInitialQuestions({ sort: 'latest' });

    // API 응답이 없거나 배열이 아닐 경우 방어 코드
    const items = response?.data?.items ?? [];

    // 상위 10개만 추려서 정적 파라미터 생성
    return items.slice(0, 10).map((question) => ({
      questionId: question.id,
    }));
  } catch (error) {
    console.error('Failed to generate params for questions:', error);
    return []; // 에러 나면 SSR로 동작하도록 빈 배열 반환
  }
}

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
