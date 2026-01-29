'use client';

export type PreviewMode = 'write' | 'preview' | 'split';

export const MODES = [
  { label: '작성', value: 'write' },
  { label: '미리보기', value: 'preview' },
  { label: '분할', value: 'split' },
] as const satisfies readonly { label: string; value: PreviewMode }[];

interface Props {
  label: string;
  value: PreviewMode;
  mode: PreviewMode;
  onChange: (mode: PreviewMode) => void;
}

export default function ModeButton({ label, value, mode, onChange }: Props) {
  const isActive = mode === value;

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
        isActive
          ? 'bg-neutral-surface-bold text-neutral-text-strong text-string-16'
          : 'text-neutral-text-weak hover:text-neutral-text-strong text-body-16'
      }`}
    >
      {label}
    </button>
  );
}
