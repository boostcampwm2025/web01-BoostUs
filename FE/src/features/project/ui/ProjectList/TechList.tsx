export default function TechList({ title }: { title: string }) {
  return (
    <div
      className={[
        // 1. 공통 레이아웃 & 정렬 & 테두리
        'h-5 w-fit rounded-2xl px-3',
        'flex items-center justify-center',
        'border-neutral-border-default border',
        'bg-brand-surface-weak text-neutral-text-default',
        'text-string-medium14',
        'cursor-pointer transition-colors duration-200',
      ].join(' ')}
    >
      {title}
    </div>
  );
}
