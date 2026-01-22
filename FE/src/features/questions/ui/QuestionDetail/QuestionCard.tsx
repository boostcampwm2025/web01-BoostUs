import ListCardChip from '@/features/questions/ui/ListCard/ListCardChip';
import CardHeader from '@/features/questions/ui/QuestionDetail/CardHeader';
import QuestionDetail from '@/features/questions/ui/QuestionDetail/QuestionDetail';
import VoteButtons from '@/features/questions/ui/QuestionDetail/VoteButtons';

const QuestionCard = ({ question }: { question: QuestionDetail }) => {
  return (
    <section className="mt-8 w-full rounded-2xl border border-neutral-border-default bg-neutral-surface-bold">
      <CardHeader question={question} />
      <div className="flex flex-row gap-6 w-full px-4 py-4 rounded-b-2xl">
        <VoteButtons question={question} />
        <div className="flex flex-col justify-between w-full">
          <div className="w-full">
            <p>{question.contents}</p>
          </div>
          <div className="border-t border-neutral-border-default w-full flex flex-row pt-4 justify-between">
            <div className="flex flex-row items-center justify-center gap-2">
              {question.hashtags.map((hashtag) => (
                <ListCardChip key={hashtag} tag={hashtag} />
              ))}
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <button className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150">
                공유
              </button>
              <button className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150">
                신고
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionCard;
