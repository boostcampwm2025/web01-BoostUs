import AnswerRegister from '@/features/questions/ui/AnswerRegister/AnswerRegister';

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}

export default async function QuestionRegisterPage({ params }: Props) {
  const { questionId } = await params;
  return <AnswerRegister questionId={questionId} />;
}
