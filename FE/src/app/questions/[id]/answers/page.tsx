import AnswerRegister from '@/features/questions/ui/AnswerRegister/AnswerRegister';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuestionRegisterPage({ params }: Props) {
  const { id } = await params;
  return <AnswerRegister questionId={id} />;
}
