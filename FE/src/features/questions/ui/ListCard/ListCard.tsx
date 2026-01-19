import { Question } from '@/features/questions/model/questions.type';
import ListCardChip from '@/features/questions/ui/ListCard/ListCardChip';
import ListCardFooter from '@/features/questions/ui/ListCard/ListCardFooter';
import ListCardTitle from '@/features/questions/ui/ListCard/ListCardTitle';
import QuestionStatus from '@/features/questions/ui/Status/Status';

const ListCard = ({ question }: { question: Question }) => {
  return (
    <div className="flex flex-col px-6 py-3 cursor-pointer bg-neutral-surface-bold">
      <QuestionStatus status={question.isResolved} />
      <ListCardTitle title={question.title} />
      <div className="flex flex-row gap-1 mt-2">
        {question.hashtags?.map((tag) => (
          <ListCardChip key={tag} tag={tag} />
        ))}
      </div>
      <ListCardFooter question={question} />
    </div>
  );
};

export default ListCard;
