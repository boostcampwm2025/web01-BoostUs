export default function TogglePill({ title }: { title: string }) {
  return (
    <div
      className={[
        // 레이아웃 & 정렬
        'h-8 w-fit rounded-2xl px-3',
        'flex items-center justify-center',

        // 색상 및 테두리 (border 클래스 추가됨)
        'bg-brand-surface-weak',
        'border-neutral-border-default border',
        'text-neutral-text-default',
        'text-string-medium14',

        // 인터랙션
        'hover:bg-brand-surface-default hover:text-neutral-surface-bold',
        'cursor-pointer transition-colors duration-200',
      ].join(' ')}
    >
      {title}
    </div>
  );
}
