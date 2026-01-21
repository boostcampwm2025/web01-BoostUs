import {
  getInitialQuestions,
  getQuestionCounts,
} from '@/features/questions/api/questions.api';
import {
  QuestionsSortBy,
  QuestionsStatusFilter,
} from '@/features/questions/model';
import QuestionsPageContent from '@/features/questions/ui/QuestionsPageContent';

const QuestionsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string }>;
}) => {
  const params = await searchParams;
  const statusParam = params.status ?? 'all';
  const sortParam = params.sort ?? 'latest';

  const validStatus: QuestionsStatusFilter = [
    'all',
    'unanswered',
    'unsolved',
    'solved',
  ].includes(statusParam)
    ? (statusParam as QuestionsStatusFilter)
    : 'all';

  const [listResponse, counts] = await Promise.all([
    getInitialQuestions({
      status: validStatus,
      sort: sortParam as QuestionsSortBy,
    }),
    getQuestionCounts(),
  ]);

  const initialQuestions = listResponse.data.items ?? [];
  const meta = listResponse.data.meta ?? {
    size: 10,
    nextCursor: null,
    prevCursor: null,
    hasNext: false,
  };

  return (
    <QuestionsPageContent
      initialQuestions={initialQuestions}
      meta={meta}
      counts={counts}
    />
  );
};

export default QuestionsPage;
