import { forwardRef, TextareaHTMLAttributes, useEffect, useRef } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

// 1. 기본 Input
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
      {...register}
      {...props}
      className={`mt-1 block w-full rounded-lg border p-2 focus:ring-brand-border-default ${
        error
          ? 'border-danger-border-default'
          : 'border-neutral-border-default focus:border-neutral-border-active'
      } ${props.className}`}
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
      {...register}
      {...props}
      className="mt-1 block w-full rounded-lg border border-neutral-border-default p-2 focus:border-neutral-border-active focus:ring-brand-border-default"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// 3. Auto-resize Textarea (로직 캡슐화)
interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
  watchValue: string; // 높이 조절을 위해 감시할 값
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

  // 높이 조절 로직을 여기서 처리 -> 메인 파일 깔끔해짐
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  }, [watchValue]);

  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-string-16 text-neutral-text-default"
      >
        {label}
      </label>
      <textarea
        {...restRegister}
        {...props}
        ref={(e) => {
          registerRef(e);
          textareaRef.current = e;
        }}
        className="mt-1 block w-full resize-none overflow-hidden rounded-lg border border-neutral-border-default p-2 focus:border-neutral-border-active focus:ring-brand-border-default"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
};
