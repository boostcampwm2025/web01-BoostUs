import MarkdownViewer from '@/shared/ui/MarkdownViewer';

interface Props {
  contents: string;
}

export default function QuestionPreview({ contents }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-neutral-text-strong text-string-16">
          미리보기
        </span>
        <span className="text-neutral-text-weak text-body-12">
          마크다운 렌더링 결과
        </span>
      </div>

      <div className="mt-2 min-h-80 rounded-lg border border-neutral-border-default p-3 bg-neutral-surface-bold overflow-auto">
        <MarkdownViewer content={contents || '아직 내용이 없어요.'} />
      </div>
    </div>
  );
}
