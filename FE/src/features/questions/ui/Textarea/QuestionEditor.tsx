'use client';

type Props = {
  contents: string;
  onChangeContents: (v: string) => void;
  contentsError: string | null;
};

export default function QuestionEditor({
  contents,
  onChangeContents,
  contentsError,
}: Props) {
  return (
    <div className="flex flex-col">
      <label className="text-neutral-text-strong text-body-14">
        내용 (마크다운)
      </label>

      <textarea
        value={contents}
        onChange={(e) => onChangeContents(e.target.value)}
        placeholder={
          '예)\n\n## 문제 상황\n...\n\n## 시도한 것\n...\n\n## 원하는 답\n...'
        }
        className="mt-2 min-h-80 w-full rounded-xl border border-neutral-border-default px-4 py-3 text-body-16 outline-none focus:border-neutral-border-strong"
      />

      {contentsError && (
        <p className="mt-2 text-body-12 text-red-600">{contentsError}</p>
      )}
    </div>
  );
}

