import { ImageUp, X } from 'lucide-react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import type { LabelHTMLAttributes } from 'react';
// 1. 썸네일 업로더
interface ThumbnailUploaderProps {
  previewUrl: string | null;
  isDragging: boolean;
  dragHandlers: LabelHTMLAttributes<HTMLLabelElement>;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

export const ThumbnailUploader = ({
  previewUrl,
  isDragging,
  dragHandlers,
  register,
  error,
}: ThumbnailUploaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="thumbnail"
        {...dragHandlers}
        className={`relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border transition-all duration-200 ${
          isDragging
            ? 'scale-[0.99] border-brand-border-default bg-brand-surface-weak ring-2 ring-brand-border-default'
            : error
              ? 'border-danger-border-default bg-danger-surface-default'
              : 'border-neutral-border-default bg-neutral-surface-default hover:bg-neutral-surface-strong hover:border-neutral-border-active'
        }`}
      >
        {previewUrl ? (
          <div className="relative h-full w-full">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                이미지 변경
              </div>
            )}
          </div>
        ) : (
          <div className="pointer-events-none flex flex-col items-center gap-4 p-4 text-center">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-2xl transition-colors ${isDragging ? 'bg-brand-dark text-brand-text-on-default' : 'bg-brand-surface-default text-brand-text-on-default'}`}
            >
              <ImageUp size={48} />
            </div>
            <div className="flex flex-col gap-1">
              <span
                className={`text-display-20 transition-colors ${isDragging ? 'text-brand-text-default' : 'text-neutral-text-strong'}`}
              >
                {isDragging
                  ? '여기에 놓으세요!'
                  : '이미지를 여기로 드래그하여 업로드 하세요'}
              </span>
              <span className="text-body-14 text-neutral-text-weak">
                PNG, JPG, JPEG, GIF 형식의 이미지를 1개 업로드할 수 있어요
              </span>
            </div>
          </div>
        )}
        <input
          id="thumbnail"
          type="file"
          accept="image/*"
          className="hidden"
          {...register}
        />
      </label>
      {error && (
        <p className="mt-1 text-string-12 text-danger-text-default">
          {error.message}
        </p>
      )}
    </div>
  );
};

// 2. 참여자 관리자
interface ParticipantManagerProps {
  participants: string[];
  addParticipant: () => void;
  removeParticipant: (index: number) => void;
  register: UseFormRegisterReturn;
  error?: FieldError;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
  isComposing: boolean;
}

export const ParticipantManager = ({
  participants,
  addParticipant,
  removeParticipant,
  register,
  error,
  isComposing,
  onCompositionStart,
  onCompositionEnd,
}: ParticipantManagerProps) => {
  return (
    <div>
      <label
        htmlFor="participantsInput"
        className="block text-string-16 text-neutral-text-default"
      >
        프로젝트 참여자
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id="participantsInput"
          type="text"
          {...register}
          className="block w-full rounded-lg border border-neutral-border-default p-2"
          placeholder="이름을 입력하세요"
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !isComposing &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              addParticipant();
            }
          }}
        />
        <button
          type="button"
          onClick={addParticipant}
          className="shrink-0 rounded-lg bg-brand-surface-default px-4 py-2 text-white"
        >
          등록
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}

      {/* 뱃지 리스트 */}
      <div className="mt-3 flex flex-row gap-2">
        {participants.map((name, index) => (
          <div
            key={`${name}-${index}`}
            className="flex items-center gap-2 rounded-full border bg-neutral-surface-bold px-3 py-2"
          >
            <span className="text-body-14">{name}</span>
            <button type="button" onClick={() => removeParticipant(index)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
