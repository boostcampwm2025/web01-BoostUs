import ListCardChip from '@/features/questions/ui/ListCard/ListCardChip';
import CardHeader from '@/features/questions/ui/QuestionDetail/CardHeader';
import type { QuestionDetail as QuestionDetailType } from '@/features/questions/model/questions.type';
import VoteButtons from '@/features/questions/ui/QuestionDetail/VoteButtons';
import { MarkdownViewer } from '@/shared/ui/MarkdownViewer/MarkdownViewer';
import { useQuestionVote } from '@/features/questions/model/useQuestionVote';
import { useAuth } from '@/features/login/model/auth.store';
import { useRouter } from 'next/navigation';
import { toast } from '@/shared/utils/toast';

const QuestionCard = ({
  question,
  hasAcceptedAnswer,
}: {
  question: QuestionDetailType;
  hasAcceptedAnswer: boolean;
}) => {
  const { member } = useAuth();
  const router = useRouter();
  const { voteQuestion } = useQuestionVote(question.id);

  const onVoteClick = (type: 'LIKE' | 'DISLIKE') => {
    if (!member) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      toast.warning('로그인이 필요한 기능입니다.');
      return;
    }
    voteQuestion.mutate({ type });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('링크가 클립보드에 복사되었어요.');
    } catch (error) {
      if (error instanceof Error) toast.error('링크 복사에 실패했어요.');
    }
  };

  const handleReport = () => {
    try {
      toast.info('준비 중인 기능이에요.');
    } catch (error) {
      if (error instanceof Error) toast.error('신고에 실패했어요.');
    }
  };

  return (
    <section className="mt-8 w-full rounded-2xl border border-neutral-border-default bg-neutral-surface-bold">
      <CardHeader question={question} hasAcceptedAnswer={hasAcceptedAnswer} />
      <div className="flex flex-row gap-6 w-full px-4 py-4 rounded-b-2xl">
        <VoteButtons
          upCount={question.upCount}
          reaction={question.reaction}
          onUpvote={() => onVoteClick('LIKE')}
          onDownvote={() => onVoteClick('DISLIKE')}
          isLoggedIn={!!member}
        />
        <div className="flex flex-col justify-between w-full">
          <div className="w-full">
            <MarkdownViewer content={question.contents} />
          </div>
          <div className="border-t border-neutral-border-default w-full flex flex-row pt-4 justify-between">
            <div className="flex flex-row items-center justify-center gap-2">
              {question.hashtags.map((hashtag) => (
                <ListCardChip key={hashtag} tag={hashtag} />
              ))}
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <button
                onClick={handleShare}
                className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150"
              >
                공유
              </button>
              <button
                onClick={handleReport}
                className="text-neutral-text-weak cursor-pointer hover:text-neutral-text-strong text-string-16 transition-colors duration-150"
              >
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
