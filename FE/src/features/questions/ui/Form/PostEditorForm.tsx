'use client';

import { useMemo, useState, useEffect } from 'react';
import BackButton from '@/shared/ui/BackButton';
import PageHeader from '@/shared/ui/PageHeader';
import ModeToggle from '../ViewMode/ModeToggle';
import QuestionEditor from '../Textarea/QuestionEditor';
import QuestionPreview from '../Textarea/QuestionPreview';
import HashTagInput from '../QuestionRegister/HashTagInput';
import { useAuth } from '@/features/login/model/auth.store';
import type { PreviewMode } from './QuestionModeButton';
import CustomTooltip from '@/shared/ui/Tooltip/CustomTooltip';
import Button from '@/shared/ui/Button/Button';

const MAX_TITLE_LENGTH = 200;
const TOOLTIP_MESSAGE_ANSWER = '답변이 채택되면 수정이나 삭제가 불가능해요';
const TOOLTIP_MESSAGE_QUESTION = '답변을 채택하면 수정이나 삭제가 불가능해요';

const normalizeTitle = (v: string) => v.replace(/\s+/g, ' ').trim();

export interface PostFormValues {
  title?: string; // 답변일 경우 undefined
  contents: string;
  hashtags?: string[]; // 답변일 경우 undefined
}

interface Props {
  type: 'question' | 'answer'; // 폼의 성격 결정
  variant: 'create' | 'edit'; // 등록 vs 수정
  initialValues?: PostFormValues;
  onSubmit: (values: PostFormValues) => Promise<undefined | { id?: string }>;
}

export default function PostEditorForm({
  type,
  variant,
  initialValues,
  onSubmit,
}: Props) {
  const { member } = useAuth();

  // --- 상태 관리 ---
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [contents, setContents] = useState(initialValues?.contents ?? '');
  const [hashTags, setHashTags] = useState<string[]>(
    initialValues?.hashtags ?? []
  );
  const [hashTagInput, setHashTagInput] = useState('');

  const [mode, setMode] = useState<PreviewMode>('split');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTriedToSubmit, setIsTriedToSubmit] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  // --- 초기값 동기화 (Edit 모드 등에서 데이터 로딩 후 반영) ---
  useEffect(() => {
    if (!initialValues) return;
    if (type === 'question') {
      setTitle(initialValues.title ?? '');
      setHashTags(initialValues.hashtags ?? []);
    }
    setContents(initialValues.contents);
  }, [initialValues, type]);

  // --- 유효성 검사 로직 ---
  const normalizedTitle = useMemo(() => normalizeTitle(title), [title]);

  const titleError = useMemo(() => {
    if (type === 'answer') return null; // 답변은 제목 검사 패스
    if (normalizedTitle.length === 0) return '제목을 입력해 주세요.';
    if (normalizedTitle.length > MAX_TITLE_LENGTH)
      return `제목은 최대 ${MAX_TITLE_LENGTH.toString()}자까지 입력할 수 있어요.`;
    return null;
  }, [normalizedTitle, type]);

  const contentsError = useMemo(() => {
    if (contents.trim().length === 0) return '내용을 입력해 주세요.';
    return null;
  }, [contents]);

  // 제출 시도 전에는 에러를 보여주지 않음
  const displayTitleError = isTriedToSubmit ? titleError : null;
  const displayContentsError = isTriedToSubmit ? contentsError : null;

  const canSubmit = !!member && !titleError && !contentsError && !isSubmitting;

  // --- 핸들러 ---
  const handleSubmit = async () => {
    setIsTriedToSubmit(true);

    if (!member) {
      alert('로그인이 필요해요.');
      return;
    }

    if (titleError || contentsError) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: type === 'question' ? normalizedTitle : undefined,
        contents,
        hashtags: type === 'question' && hashTags.length ? hashTags : undefined,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : '요청에 실패했어요.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 텍스트 매핑 ---
  const titleText = type === 'question' ? '질문' : '답변';
  const actionText = variant === 'create' ? '등록' : '수정';
  const buttonLabel = isSubmitting
    ? `${actionText} 중...`
    : `${actionText}하기`;

  return (
    <div className="flex flex-col w-full font-sans max-w-270">
      {/* 1. 상단 네비게이션 및 헤더 */}
      <div className="mt-8">
        <BackButton url="/questions" />
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <PageHeader
          title={`${titleText} ${actionText}`}
          subtitle={
            type === 'question'
              ? '제목과 내용을 작성하고, 마크다운 미리보기로 확인하세요.'
              : '지식을 공유해 주세요. 마크다운 미리보기를 지원합니다.'
          }
        />
        {!member && (
          <div className="mt-2 rounded-xl border border-neutral-border-default bg-neutral-surface-strong px-4 py-3">
            <p className="text-neutral-text-weak text-body-14">
              현재 로그인 정보(member)가 없어 비활성화되어 있어요.
            </p>
          </div>
        )}
      </div>

      {/* 2. 메인 에디터 컨테이너 (QuestionForm 스타일 유지) */}
      <div className="mt-8 overflow-hidden border border-neutral-border-default rounded-2xl">
        {/* 툴바 */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-border-default bg-neutral-surface-strong">
          <ModeToggle mode={mode} onChange={setMode} />
          <CustomTooltip
            content={
              type === 'answer'
                ? TOOLTIP_MESSAGE_ANSWER
                : TOOLTIP_MESSAGE_QUESTION
            }
            contentClassName="bg-brand-surface-default text-brand-text-on-default"
          >
            <Button
              buttonStyle="primary"
              disabled={!canSubmit}
              onClick={handleSubmit}
              content={buttonLabel}
            />
          </CustomTooltip>
        </div>

        {/* 입력 영역 */}
        <div className="px-6 py-4 bg-white">
          {/* (A) 제목 입력: 질문일 때만 노출 & 작성 모드일 때만 노출 */}
          {type === 'question' && (mode === 'write' || mode === 'split') && (
            <div className="mb-4">
              <div className="flex items-end justify-between">
                <label className="text-neutral-text-strong text-string-16">
                  제목
                </label>
                <span className="text-neutral-text-weak text-body-12">
                  {normalizedTitle.length}/{MAX_TITLE_LENGTH}
                </span>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={MAX_TITLE_LENGTH}
                placeholder="질문 제목을 입력해 주세요"
                className={`mt-2 w-full rounded-lg text-neutral-text-default placeholder:text-neutral-text-weak px-3 py-3 text-body-16 outline-none transition-colors duration-150 border ${
                  displayTitleError
                    ? 'border-danger-border-default'
                    : 'border-neutral-border-default focus:border-brand-border-default'
                }`}
              />
              {displayTitleError && (
                <p className="my-2 text-body-12 text-danger-text-default">
                  {displayTitleError}
                </p>
              )}
            </div>
          )}

          {/* (B) 본문 에디터 */}
          {(mode === 'write' || mode === 'split') && (
            <QuestionEditor
              contents={contents}
              onChangeContents={setContents}
              contentsError={displayContentsError}
            />
          )}

          {/* (C) 미리보기 */}
          {(mode === 'preview' || mode === 'split') && (
            <QuestionPreview contents={contents} />
          )}

          {/* (D) 해시태그: 질문일 때만 노출 */}
          {type === 'question' && (
            <div className="mt-4">
              <HashTagInput
                value={hashTagInput}
                onChangeValue={setHashTagInput}
                hashTags={hashTags}
                onAdd={(v) => setHashTags((prev) => [...prev, v])}
                onRemove={(v) =>
                  setHashTags((prev) => prev.filter((x) => x !== v))
                }
                isComposing={isComposing}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
