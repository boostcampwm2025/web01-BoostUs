/* eslint-disable no-alert */
'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import ModeToggle from '../ViewMode/ModeToggle';
import type { PreviewMode } from '../QuestionRegister/QuestionModeButton';
import QuestionEditor from '../Textarea/QuestionEditor';
import QuestionPreview from '../Textarea/QuestionPreview';
import { createAnswer } from '../../api/questions.api';
import { getClientMemberId } from '@/shared/utils/getClientMemberId';
type Props = {
  questionId: string; // 또는 number/bigint string 형태로 맞춰
};

export default function AnswerRegister({ questionId }: Props) {
  const router = useRouter();
  const memberId = useMemo(() => getClientMemberId(), []);

  const [contents, setContents] = useState('');
  const [mode, setMode] = useState<PreviewMode>('split');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contentsError = useMemo(() => {
    if (contents.trim().length === 0) return '내용을 입력해 주세요.';
    return null;
  }, [contents]);

  const handleSubmit = async () => {
    if (contentsError) return;

    setIsSubmitting(true);
    try {
      const created = await createAnswer(memberId || '1', questionId, {
        contents,
      });

      router.push(`/questions/${questionId}`);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : '답변 등록에 실패했어요.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 overflow-hidden border border-neutral-border-default rounded-2xl">
      <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-border-default bg-neutral-surface-strong">
        <ModeToggle mode={mode} onChange={setMode} />

        <button
          type="button"
          onClick={handleSubmit}
          className="h-10 px-4 rounded-xl bg-brand-surface-default text-brand-text-on-default disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!!contentsError || isSubmitting}
        >
          {isSubmitting ? '등록 중...' : '답변 등록'}
        </button>
      </div>

      <div className="p-6 bg-white">
        {(mode === 'write' || mode === 'split') && (
          <QuestionEditor
            contents={contents}
            onChangeContents={setContents}
            contentsError={contentsError}
          />
        )}

        {(mode === 'preview' || mode === 'split') && (
          <QuestionPreview contents={contents} />
        )}
      </div>
    </div>
  );
}
