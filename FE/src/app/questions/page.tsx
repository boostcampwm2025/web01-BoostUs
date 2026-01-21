import { getInitialQuestions } from '@/features/questions/api/questions.api';
import { QuestionsStatusFilter } from '@/features/questions/model';
import QuestionsPageContent from '@/features/questions/ui/QuestionsPageContent';

const QuestionsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) => {
  const params = await searchParams;
  const statusParam = params.status ?? 'all';

  const validStatus: QuestionsStatusFilter = [
    'all',
    'unanswered',
    'unsolved',
    'solved',
  ].includes(statusParam)
    ? (statusParam as QuestionsStatusFilter)
    : 'all';

  console.log(`[server] status: ${validStatus}`);

  const response = await getInitialQuestions({ status: validStatus });

  const initialQuestions = response.data.items ?? [];
  const meta = response.data.meta ?? {
    size: 10,
    nextCursor: null,
    prevCursor: null,
    hasNext: false,
  };

  return (
    <QuestionsPageContent initialQuestions={initialQuestions} meta={meta} />
  );
};

export default QuestionsPage;
