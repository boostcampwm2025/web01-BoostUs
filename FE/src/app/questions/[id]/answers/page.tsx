import AnswerRegister from '@/features/questions/ui/AnswerRegister/AnswerRegister';

type Props = {
  params: {
    questionId: string;
  };
};

export default function QuestionRegisterPage({ params }: Props) {
  return <AnswerRegister questionId={params.questionId} />;
}
