import type { Question } from '@/features/questions/model/questions.type';
import ListCard from '@/features/questions/ui/ListCard/ListCard';
import ListHeader from '@/features/questions/ui/List/ListHeader';
import { useMemo } from 'react';

const QuestionsList = ({
  initialQuestions,
}: {
  initialQuestions: Question[];
}) => {
  const filteredAndSortedQuestions = useMemo(() => {
    const result = [...initialQuestions];
    return result;
  }, [initialQuestions]);

  return (
    <div className="flex flex-col w-full mt-4 overflow-hidden border border-neutral-border-default rounded-2xl">
      <ListHeader />
      {filteredAndSortedQuestions.map((question, index) => (
        <div
          key={question.id}
          className={
            index !== filteredAndSortedQuestions.length - 1
              ? 'border-b border-neutral-border-default'
              : ''
          }
        >
          <ListCard question={question} />
        </div>
      ))}
    </div>
  );
};

export default QuestionsList;
