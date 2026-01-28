import type {
  Question,
  QuestionCounts,
} from '@/features/questions/model/questions.type';
import ListCard from '@/features/questions/ui/ListCard/ListCard';
import ListHeader from '@/features/questions/ui/List/ListHeader';

const QuestionsList = ({
  initialQuestions,
  counts,
}: {
  initialQuestions: Question[];
  counts: QuestionCounts;
}) => {
  return (
    <div className="flex flex-col w-full mt-4 overflow-hidden border divide-y border-neutral-border-default divide-neutral-border-default rounded-2xl">
      <ListHeader counts={counts} />
      {initialQuestions.map((question) => (
        <ListCard key={question.id} question={question} />
      ))}
      {initialQuestions.length === 0 && (
        <div className="flex items-center justify-center w-full h-32 bg-neutral-surface-bold">
          <p className="text-neutral-text-weak text-body-16">
            질문이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionsList;
