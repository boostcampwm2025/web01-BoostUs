import { forwardRef, TextareaHTMLAttributes, useEffect, useRef } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

// 기본 Input
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
}

export const FormInput = ({
  label,
  error,
  register,
  ...props
}: FormInputProps) => (
  <div className="flex-1">
    <label
      htmlFor={props.id}
      className="block text-string-16 text-neutral-text-default"
    >
      {label}
    </label>
    <input
      {...props}
      {...register}
      className={`mt-1 block w-full rounded-lg border p-2 focus:ring-brand-border-default ${
        error
          ? 'border-danger-border-default'
          : 'border-neutral-border-default focus:border-neutral-border-active'
      } ${props.className ?? ''}`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
  </div>
);

// 2. Select
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  error?: FieldError;
  register: UseFormRegisterReturn;
}

export const FormSelect = ({
  label,
  options,
  error,
  register,
  ...props
}: FormSelectProps) => (
  <div className="flex-1">
    <label
      htmlFor={props.id}
      className="block text-neutral-text-default text-string-16"
    >
      {label}
    </label>
    <select
      {...props}
      {...register}
      className="mt-1 block w-full rounded-lg border border-neutral-border-default p-2 focus:border-neutral-border-active focus:ring-brand-border-default"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
  </div>
);

//3. Textarea

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
  watchValue: string;
}

export const FormTextarea = ({
  label,
  error,
  register,
  watchValue,
  ...props
}: FormTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: registerRef, ...restRegister } = register;

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    // 1. 높이를 'auto'로 리셋하여 줄어든 내용까지 감지
    el.style.height = 'auto';
    // 2. 실제 스크롤 높이(내용물 높이) + 테두리 값 등을 고려해 설정
    el.style.height = `${el.scrollHeight.toString()}px`;
  };

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      adjustHeight();
    });

    const timer1 = setTimeout(() => {
      adjustHeight();
    }, 10);

    const timer2 = setTimeout(() => {
      adjustHeight();
    }, 150);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [watchValue]);

  return (
    <div className="flex-1">
      <label
        htmlFor={props.id}
        className="block text-string-16 text-neutral-text-default"
      >
        {label}
      </label>
      <textarea
        {...props}
        {...restRegister}
        rows={1}
        ref={(e) => {
          registerRef(e);
          textareaRef.current = e;
        }}
        onInput={adjustHeight}
        className={`mt-1 block w-full resize-none overflow-hidden rounded-lg border p-2 focus:ring-brand-border-default ${
          error
            ? 'border-danger-border-default'
            : 'border-neutral-border-default focus:border-neutral-border-active'
        } ${props.className ?? ''}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
};
