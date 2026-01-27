import TogglePill from '@/shared/ui/TogglePill';

type SortItem = string | { label: string; value: string };

interface TogglePillsProps {
  sort: SortItem[];
  onChange: (value: string) => void;
  selected: string;
}

export default function TogglePills({
  sort,
  selected,
  onChange,
}: TogglePillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sort.map((item) => {
        const isObject = typeof item === 'object';
        const label = isObject ? item.label : item;
        const value = isObject ? item.value : item;
        const key = isObject ? value : item;

        return (
          <div key={key} onClick={() => onChange(value)}>
            <TogglePill title={label} isSelected={value === selected} />
          </div>
        );
      })}
    </div>
  );
}
