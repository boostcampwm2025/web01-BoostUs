import { Answer } from '@/features/questions/model/questions.type';
import CardHeader from '@/features/questions/ui/QuestionDetail/CardHeader';
import VoteButtons from '@/features/questions/ui/QuestionDetail/VoteButtons';
import { CircleCheck } from 'lucide-react';

const AnswerCard = ({ answer }: { answer: Answer }) => {
  return (
    <section className="mt-6 w-full rounded-2xl border border-neutral-border-default bg-neutral-surface-bold">
      <CardHeader answer={answer} />
      <div className="flex flex-row gap-6 w-full px-4 py-4 rounded-b-2xl">
        <VoteButtons />
        <div className="flex flex-col justify-between w-full">
          <div className="w-full">
            <p>{answer.contents}</p>
          </div>
          <div className="border-t border-neutral-border-default w-full flex flex-row pt-4 justify-between">
            <button className="gap-1 flex flex-row items-center justify-center text-neutral-text-default cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150">
              <CircleCheck size={16} />
              <span>채택하기</span>
            </button>
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

export default AnswerCard;
