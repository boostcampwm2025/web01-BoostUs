import Link from 'next/link';

const QuestionButton = () => {
  return (
    <Link href="/questions/register">
      <button
        type="button"
        className="flex items-center justify-center px-4 py-2 cursor-pointer whitespace-nowrap rounded-lg bg-brand-surface-default hover:bg-brand-dark transition-colors duration-150"
      >
        <span className="text-string-16 text-brand-text-on-default">
          질문하기
        </span>
      </button>
    </Link>
  );
};

export default QuestionButton;
