'use client';

import ListCardChip from '@/features/questions/ui/ListCard/ListCardChip';
import CardHeader from '@/features/questions/ui/QuestionDetail/CardHeader';
import type { QuestionDetail as QuestionDetailType } from '@/features/questions/model/questions.type';
import VoteButtons from '@/features/questions/ui/QuestionDetail/VoteButtons';
import { likeQuestion, dislikeQuestion } from '../../api/questions.api';
import { MarkdownViewer } from '@/shared/ui/MarkdownViewer/MarkdownViewer';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const QuestionCard = ({ question }: { question: QuestionDetailType }) => {
  const router = useRouter();
  const [localQuestion, setLocalQuestion] = useState(question);

  useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  const handleVote = async (type: 'up' | 'down') => {
    const previousQuestion = { ...localQuestion };

    setLocalQuestion((prev) => ({
      ...prev,
      upCount: type === 'up' ? prev.upCount + 1 : prev.upCount,
      downCount: type === 'down' ? prev.downCount + 1 : prev.downCount,
    }));

    try {
      if (type === 'up') {
        await likeQuestion(question.id);
      } else {
        await dislikeQuestion(question.id);
      }
      router.refresh();
    } catch (error) {
      console.error(`Error ${type}voting question:`, error);
      setLocalQuestion(previousQuestion); // 실패 시 롤백
      alert('투표 처리에 실패했습니다.');
    }
  };

  return (
    <section className="mt-8 w-full rounded-2xl border border-neutral-border-default bg-neutral-surface-bold">
      <CardHeader question={question} />
      <div className="flex flex-row gap-6 w-full px-4 py-4 rounded-b-2xl">
        <VoteButtons
          question={question}
          onUpvote={() => handleVote('up')}
          onDownvote={() => handleVote('down')}
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
