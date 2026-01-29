'use client';

export type PreviewMode = 'write' | 'preview' | 'split';

export const MODES = [
  { label: '작성', value: 'write' },
  { label: '미리보기', value: 'preview' },
  { label: '분할', value: 'split' },
] as const satisfies ReadonlyArray<{ label: string; value: PreviewMode }>;

type Props = {
  label: string;
  value: PreviewMode;
  mode: PreviewMode;
  onChange: (mode: PreviewMode) => void;
};

export default function ModeButton({ label, value, mode, onChange }: Props) {
  const isActive = mode === value;

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`px-3 py-2 rounded-xl text-body-14 transition-colors ${
        isActive
          ? 'bg-neutral-surface-bold text-neutral-text-strong'
          : 'text-neutral-text-weak hover:text-neutral-text-strong'
      }`}
    >
      {label}
    </button>
  );
}
