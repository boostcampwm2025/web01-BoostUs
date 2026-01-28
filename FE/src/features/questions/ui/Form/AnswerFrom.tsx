/* eslint-disable no-alert */
'use client';

import { useMemo, useState, useEffect } from 'react';
import ModeToggle from '../ViewMode/ModeToggle';
import type { PreviewMode } from '../Form/QuestionModeButton';
import QuestionEditor from '../Textarea/QuestionEditor';
import QuestionPreview from '../Textarea/QuestionPreview';
import { useAuth } from '@/features/login/model/auth.store';

type InitialValues = {
  contents: string;
};

type Props = {
  variant: 'create' | 'edit';
  initialValues?: InitialValues; // edit에서 사용
  onSubmit: (body: { contents: string }) => Promise<void>;
};

export default function AnswerForm({
  variant,
  initialValues,
  onSubmit,
}: Props) {
  const { member } = useAuth();

  const [contents, setContents] = useState(initialValues?.contents ?? '');
  const [mode, setMode] = useState<PreviewMode>('split');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ edit에서 initialValues가 늦게 들어와도 반영
  useEffect(() => {
    if (!initialValues) return;
    setContents(initialValues.contents);
  }, [initialValues]);

  const contentsError = useMemo(() => {
    if (contents.trim().length === 0) return '내용을 입력해 주세요.';
    return null;
  }, [contents]);

  const canSubmit = !!member && !contentsError && !isSubmitting;

  const handleSubmit = async () => {
    if (!member) {
      alert('로그인이 필요해요.');
      return;
    }
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ contents });
    } catch (e) {
      const message = e instanceof Error ? e.message : '요청에 실패했어요.';
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
          disabled={!canSubmit}
          className="h-10 px-4 rounded-xl cursor-pointer bg-brand-surface-default text-brand-text-on-default disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? variant === 'create'
              ? '등록 중...'
              : '수정 중...'
            : variant === 'create'
              ? '답변 등록'
              : '답변 수정'}
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
