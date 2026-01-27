// 필요햔 데이터 : id, title, isResolved: 채택 됐는지, upCount, answerCount,

import { Question } from '@/features/questions/model/questions.type';
import ListCardChip from '@/features/questions/ui/ListCard/ListCardChip';
import ListCardFooter from '@/features/questions/ui/ListCard/ListCardFooter';
import ListCardTitle from '@/features/questions/ui/ListCard/ListCardTitle';
import QuestionStatus from '@/features/questions/ui/Status/Status';
import Link from 'next/link';

const QnaCard = ({ question }: { question: Question }) => {
  return (
    <Link href={`/questions/${question.id}`}>
      <div className="flex flex-col px-6 py-3 cursor-pointer bg-neutral-surface-bold">
        <QuestionStatus status={question.isResolved} />
        <ListCardTitle title={question.title} />
        <div className="flex flex-row items-center justify-center gap-1 mt-2">
          {question.hashtags?.map((tag) => (
            <ListCardChip key={tag} tag={tag} />
          ))}
          <ListCardFooter question={question} />
        </div>
      </div>
    </Link>
  );
};

export default QnaCard;
