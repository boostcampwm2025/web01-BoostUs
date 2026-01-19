import { CircleQuestionMark } from 'lucide-react';

const QuestionStatus = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-1 px-2 py-1 rounded-lg w-fit bg-grayscale-300">
      <CircleQuestionMark
        className="text-neutral-text-weak"
        strokeWidth={2}
        size={14}
      />
      <span className="text-neutral-text-weak text-string-12">열림</span>
    </div>
  );
};

export default QuestionStatus;
