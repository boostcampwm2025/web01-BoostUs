import { CheckCircle, CircleQuestionMark } from 'lucide-react';

const QuestionStatus = ({ status }: { status: boolean }) => {
  if (status) {
    return (
      <div className="flex flex-row items-center justify-center gap-1 px-2 py-1 rounded-lg w-fit bg-success-surface-default">
        <CheckCircle className="text-accent-green" strokeWidth={2} size={14} />
        <span className="text-accent-green text-string-12">채택됨</span>
      </div>
    );
  } else {
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
  }
};

export default QuestionStatus;
