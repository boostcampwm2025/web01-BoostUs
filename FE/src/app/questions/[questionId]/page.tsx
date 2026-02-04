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
export const dynamicParams = true;

/**
 * 정적 파라미터 생성: 빌드 시점에 최신 질문 10개를 미리 HTML로 생성
 * 백엔드 API가 사용 불가능한 경우 (로컬 빌드 등) 빈 배열을 반환하여 동적 렌더링 사용
 */
export async function generateStaticParams() {
  // 백엔드 API URL이 설정되지 않은 경우 정적 생성 스킵
  if (!process.env.INTERNAL_API_URL) {
    console.warn(
      '[questions] INTERNAL_API_URL not set. Skipping static generation.'
    );
    return [];
  }

  try {
    const response = await getInitialQuestions(
      { sort: 'latest' },
      { skipStore: true }
    );

    // API 응답이 없거나 배열이 아닐 경우 방어 코드
    const items = response?.data?.items ?? [];

    // 상위 10개만 추려서 정적 파라미터 생성
    const params = items.slice(0, 10).map((question) => ({
      questionId: question.id,
    }));

    console.log(`[questions] Generated ${String(params.length)} static params`);
    return params;
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
