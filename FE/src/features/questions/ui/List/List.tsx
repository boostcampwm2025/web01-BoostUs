import ListCard from '@/features/questions/ui/List/ListCard';
import ListHeader from '@/features/questions/ui/List/ListHeader';

const QuestionsList = () => {
  return (
    <div className="flex flex-col w-full mt-4 border border-neutral-border-default rounded-2xl">
      <ListHeader />
      <ListCard />
    </div>
  );
};

export default QuestionsList;
