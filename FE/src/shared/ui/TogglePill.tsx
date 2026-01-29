export default function TogglePill({
  title,
  isSelected,
}: {
  title: string;
  isSelected: boolean;
}) {
  return (
    <div
      className={[
        // 1. 공통 레이아웃 & 정렬 & 테두리
        'h-8 w-fit rounded-2xl px-3',
        'flex items-center justify-center',
        'border-neutral-border-default border',
        'text-string-14',
        'cursor-pointer transition-colors duration-200',

        // 2. 선택 여부에 따른 색상 및 인터랙션 처리
        isSelected
          ? 'bg-brand-surface-default text-brand-text-on-default border-none' // 선택됨
          : 'bg-brand-surface-weak text-neutral-text-default hover:bg-brand-surface-default hover:text-brand-text-on-default', // 선택 안됨
      ].join(' ')}
    >
      {title}
    </div>
  );
}
