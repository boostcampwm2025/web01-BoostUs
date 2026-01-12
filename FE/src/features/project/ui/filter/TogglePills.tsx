import TogglePill from '@/shared/ui/TogglePill';

interface TogglePillsProps {
  sort: string[];
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
      {sort.map((item) => (
        <div key={item} onClick={() => onChange(item)}>
          <TogglePill title={item} isSelected={item === selected} />
        </div>
      ))}
    </div>
  );
}
