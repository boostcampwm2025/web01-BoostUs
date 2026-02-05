import {
  getInitialQuestions,
  getQuestionCounts,
} from '@/features/questions/api/questions.api';
import {
  QuestionsSortBy,
  QuestionsStatusFilter,
} from '@/features/questions/model';
import QuestionsPageContent from '@/features/questions/ui/QuestionsPageContent';

export const revalidate = 600;

interface QuestionsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const QuestionsPage = async ({ searchParams }: QuestionsPageProps) => {
  const params = await searchParams;
  const statusRaw = typeof params.status === 'string' ? params.status : 'all';
  const sortRaw = typeof params.sort === 'string' ? params.sort : 'latest';

  const validStatus: QuestionsStatusFilter = [
    'all',
    'unanswered',
    'unsolved',
    'solved',
  ].includes(statusRaw)
    ? (statusRaw as QuestionsStatusFilter)
    : 'all';

  const validSort = (
    ['latest', 'views', 'votes'] as QuestionsSortBy[]
  ).includes(sortRaw as QuestionsSortBy)
    ? (sortRaw as QuestionsSortBy)
    : 'latest';

  const [listResponse, counts] = await Promise.all([
    getInitialQuestions({
      status: validStatus,
      sort: validSort,
    }),
    getQuestionCounts(),
  ]);

  const initialQuestions = listResponse.data.items ?? [];
  const meta = listResponse.data.meta ?? {
    size: 10,
    nextCursor: null,
    prevCursor: null,
    hasNext: false,
    count: 0,
    page: 1,
  };

  const countData = counts ?? {
    total: 0,
    noAnswer: 0,
    unsolved: 0,
    solved: 0,
  };

  return (
    <QuestionsPageContent
      initialQuestions={initialQuestions}
      meta={meta}
      counts={countData}
    />
  );
};

export default QuestionsPage;
