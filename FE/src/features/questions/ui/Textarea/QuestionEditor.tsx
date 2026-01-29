interface Props {
  contents: string;
  onChangeContents: (v: string) => void;
  contentsError: string | null;
}

export default function QuestionEditor({
  contents,
  onChangeContents,
  contentsError,
}: Props) {
  const hasError = !!contentsError;

  return (
    <div className="flex flex-col mb-4">
      <label className="text-neutral-text-strong text-string-16">내용</label>
      <textarea
        value={contents}
        onChange={(e) => onChangeContents(e.target.value)}
        placeholder={
          '예)\n\n## 문제 상황\n...\n\n## 시도한 것\n...\n\n## 원하는 답\n...'
        }
        className={`mt-2 min-h-80 w-full rounded-lg placeholder:text-neutral-text-weak text-neutral-text-default px-3 py-3 text-body-16 outline-none border ${
          hasError
            ? 'border-danger-border-default'
            : 'border-neutral-border-default focus:border-brand-border-default'
        }`}
      />

      {contentsError && (
        <p className="my-2 text-body-12 text-danger-text-default">
          {contentsError}
        </p>
      )}
    </div>
  );
}
