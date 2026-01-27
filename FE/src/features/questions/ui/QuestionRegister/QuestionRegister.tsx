/* eslint-disable no-alert */
'use client';

import { createQuestion } from '@/features/questions/api/questions.api';
import BackButton from '@/shared/ui/BackButton';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import ModeToggle from '../ViewMode/ModeToggle';
import type { PreviewMode } from './QuestionModeButton';
import QuestionPreview from '../Textarea/QuestionPreview';
import QuestionEditor from '../Textarea/QuestionEditor';
import HashTagInput from './HashTagInput';
import { useAuth } from '@/features/login/model/auth.context';
const MAX_TITLE_LENGTH = 200;

const normalizeTitle = (v: string) => v.replace(/\s+/g, ' ').trim();

export default function QuestionRegister() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [hashTagInput, setHashTagInput] = useState('');
  const [hashTags, setHashTags] = useState<string[]>([]);
  const [mode, setMode] = useState<PreviewMode>('split');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const { member } = useAuth();

  const normalizedTitle = useMemo(() => normalizeTitle(title), [title]);
  const titleError = useMemo(() => {
    if (normalizedTitle.length === 0) return '제목을 입력해 주세요.';
    if (normalizedTitle.length > MAX_TITLE_LENGTH)
      return `제목은 최대 ${MAX_TITLE_LENGTH}자까지 입력할 수 있어요.`;
    return null;
  }, [normalizedTitle]);

  const contentsError = useMemo(() => {
    if (contents.trim().length === 0) return '내용을 입력해 주세요.';
    return null;
  }, [contents]);

  const canSubmit = !!member && !titleError && !contentsError && !isSubmitting;

  const handleSubmit = async () => {
    if (!member) {
      alert('로그인이 필요해요. (member를 찾을 수 없습니다)');
      return;
    }

    if (titleError || contentsError) return;

    setIsSubmitting(true);
    try {
      const created = await createQuestion({
        title: normalizedTitle,
        contents,
        hashtags: hashTags.length ? hashTags : undefined,
      });

      router.push(`/questions/${created.id}`);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : '질문 등록에 실패했어요.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full font-sans max-w-270">
      <div className="mt-8">
        <BackButton />
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <h1 className="text-neutral-text-strong text-display-32">질문 등록</h1>
        <p className="text-neutral-text-default text-body-16">
          제목과 내용을 작성하고, 마크다운 미리보기로 확인하세요.
        </p>
        {!member && (
          <div className="mt-2 rounded-xl border border-neutral-border-default bg-neutral-surface-strong px-4 py-3">
            <p className="text-neutral-text-weak text-body-14">
              현재 로그인 정보(member)가 없어 등록이 비활성화되어 있어요.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 overflow-hidden border border-neutral-border-default rounded-2xl">
        <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-border-default bg-neutral-surface-strong">
          <ModeToggle mode={mode} onChange={setMode} />

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="h-10 px-4 rounded-xl cursor-pointer bg-brand-surface-default text-brand-text-on-default disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '등록 중...' : '등록하기'}
          </button>
        </div>

        <div className="p-6 bg-white">
          {/* 제목 */}
          {(mode === 'write' || mode === 'split') && (
            <div className="mb-4">
              <div className="flex items-end justify-between">
                <label className="text-neutral-text-strong text-body-14">
                  제목
                </label>
                <span className="text-neutral-text-weak text-body-12">
                  {normalizedTitle.length}/{MAX_TITLE_LENGTH}
                </span>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={MAX_TITLE_LENGTH + 20}
                placeholder="질문 제목을 입력해 주세요"
                className="mt-2 w-full rounded-xl border border-neutral-border-default px-4 py-3 text-body-16 outline-none focus:border-neutral-border-strong"
              />
              {titleError && (
                <p className="mt-2 text-body-12 text-red-600">{titleError}</p>
              )}
            </div>
          )}

          {/* 본문 + 프리뷰 */}
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

          {/* 해시 태그 */}
          <HashTagInput
            value={hashTagInput}
            onChangeValue={setHashTagInput}
            hashTags={hashTags}
            onAdd={(v) => setHashTags((prev) => [...prev, v])}
            onRemove={(v) => setHashTags((prev) => prev.filter((x) => x !== v))}
            isComposing={isComposing}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
        </div>
      </div>
    </div>
  );
}
