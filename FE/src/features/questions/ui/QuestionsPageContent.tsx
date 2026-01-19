import { Question } from '@/features/questions/model/questions.type';
import QuestionButton from '@/features/questions/ui/Button/QuestionButton';
import QuestionsHeader from '@/features/questions/ui/Header/Header';
import QuestionsList from '@/features/questions/ui/List/List';
import QuestionsSearchBar from '@/features/questions/ui/SearchBar/SearchBar';

const QuestionsPageContent = ({
  initialQuestions,
}: {
  initialQuestions: Question[];
}) => {
  return (
    <div className="flex flex-col w-full font-sans max-w-270">
      <QuestionsHeader />
      <div className="flex flex-row gap-4 mt-8">
        <QuestionsSearchBar />
        <QuestionButton />
      </div>
      <QuestionsList initialQuestions={initialQuestions} />
    </div>
  );
};

export default QuestionsPageContent;
