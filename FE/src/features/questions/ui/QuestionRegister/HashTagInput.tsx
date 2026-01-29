'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const MAX_Hash_TAG = 10;
const MAX_Hash_TAG_LENGTH = 30;

interface Props {
  value: string;
  onChangeValue: (v: string) => void;

  hashTags: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;

  isComposing: boolean;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;

  maxCount?: number;
  maxLength?: number;
}

export default function HashTagInput({
  value,
  onChangeValue,
  hashTags,
  onAdd,
  onRemove,
  isComposing,
  onCompositionStart,
  onCompositionEnd,
  maxCount = MAX_Hash_TAG,
  maxLength = MAX_Hash_TAG_LENGTH,
}: Props) {
  const [localError, setLocalError] = useState<string | null>(null);

  const tryAdd = (raw: string) => {
    const next = raw.trim();
    setLocalError(null);
    if (!next) return;

    if (next.length > maxLength) {
      const msg = `태그는 최대 ${maxLength.toString()}자까지 입력할 수 있어요.`;
      setLocalError(msg);
      alert(msg);
      return;
    }

    if (hashTags.length >= maxCount) {
      const msg = `태그는 최대 ${maxCount.toString()}개까지 추가할 수 있어요.`;
      setLocalError(msg);
      alert(msg);
      return;
    }

    const exists = hashTags.some((s) => s.toLowerCase() === next.toLowerCase());
    if (exists) {
      onChangeValue('');
      return;
    }

    onAdd(next);
    onChangeValue('');
  };

  return (
    <div className="mb-6 mt-4">
      <div className="flex items-end justify-between">
        <label className="text-neutral-text-strong text-string-16">태그</label>
        <span className="text-neutral-text-weak text-body-12">
          {hashTags.length}/{maxCount}
        </span>
      </div>

      <input
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          if (isComposing || e.nativeEvent.isComposing) return;
          e.preventDefault();
          tryAdd(value);
        }}
        placeholder="예) React (Enter로 추가)"
        className="mt-2 w-full rounded-lg placeholder:text-neutral-text-weak border border-neutral-border-default px-3 py-3 text-body-16 outline-none focus:border-brand-border-default transition-colors duration-150"
      />

      {localError && (
        <p className="mt-2 text-body-12 text-danger-text-default">
          {localError}
        </p>
      )}

      {hashTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {hashTags.map((t) => (
            <div
              key={t}
              className="flex items-center gap-2 rounded-full border border-neutral-border-default bg-neutral-surface-strong px-3 py-2"
            >
              <span className="text-string-14 text-neutral-text-default">
                {t}
              </span>
              <button
                type="button"
                onClick={() => onRemove(t)}
                className="text-body-14 text-neutral-text-weak hover:text-neutral-text-strong cursor-pointer"
                aria-label={`${t} 제거`}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
