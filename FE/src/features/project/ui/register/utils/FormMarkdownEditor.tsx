import { TextareaHTMLAttributes, useEffect, useRef, useState } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import ModeToggle from '@/features/questions/ui/ViewMode/ModeToggle';
import QuestionPreview from '@/features/questions/ui/Textarea/QuestionPreview';
import type { PreviewMode } from '@/features/questions/ui/Form/QuestionModeButton'; // 타입 정의가 있는 곳

interface FormMarkdownEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
  watchValue: string;
  autoResize?: boolean;
}

export const FormMarkdownEditor = ({
  label,
  error,
  register,
  watchValue,
  autoResize = true,
  ...props
}: FormMarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: registerRef, ...restRegister } = register;

  // 기본 모드는 'write'로 설정
  const [mode, setMode] = useState<PreviewMode>('write');

  // 높이 조절 로직 (기존 FormTextarea와 동일)
  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (!autoResize || mode !== 'write') return; // 미리보기 모드일 땐 높이 조절 중단

    // 내용이 변경되거나 모드가 'write'로 돌아왔을 때 높이 재계산
    requestAnimationFrame(() => adjustHeight());
  }, [watchValue, autoResize, mode]);

  return (
    <div className="flex-1">
      {/* 상단 헤더: 라벨과 모드 토글 버튼 */}
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={props.id}
          className="block text-string-16 text-neutral-text-default"
        >
          {label}
        </label>

        {/* 모드 토글 버튼 (작성 / 미리보기 / 분할) */}
        <div className="scale-100 origin-right rounded-lg border border-neutral-border-default bg-neutral-surface-strong p-[2px]">
          <ModeToggle mode={mode} onChange={setMode} />
        </div>
      </div>

      <div className="relative">
        {/* 작성 모드 또는 분할 모드일 때 Textarea 표시 */}
        {(mode === 'write' || mode === 'split') && (
          <textarea
            {...props}
            {...restRegister}
            rows={mode === 'split' ? 10 : 6} // 분할 모드일 땐 높이를 좀 더 확보
            ref={(e) => {
              registerRef(e);
              textareaRef.current = e;
            }}
            onInput={autoResize ? adjustHeight : undefined}
            className={`block w-full resize-none rounded-lg border p-3 focus:ring-brand-border-default leading-relaxed ${
              error
                ? 'border-danger-border-default'
                : 'border-neutral-border-default focus:border-neutral-border-active'
            } ${props.className ?? ''} ${mode === 'split' ? 'mb-4' : ''}`}
            // split 모드일 때 하단 여백 추가
          />
        )}

        {/*  미리보기 모드 또는 분할 모드일 때 Preview 표시 */}
        {(mode === 'preview' || mode === 'split') && (
          <div
            className={`rounded-lg border border-neutral-border-default p-4 bg-neutral-surface-default min-h-[150px] ${mode === 'preview' ? 'mt-1' : ''}`}
          >
            {/* 내용이 없을 경우 안내 문구 */}
            {!watchValue ? (
              <p className="text-neutral-text-weak text-body-14">
                미리보기 내용이 없습니다.
              </p>
            ) : (
              <QuestionPreview contents={watchValue} />
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
};
