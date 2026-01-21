import { Circle, CircleCheck } from 'lucide-react';

const DropdownSelect = ({
  isSelected,
  label,
  onSelect,
}: {
  isSelected: boolean;
  label: string;
  onSelect: () => void;
}) => {
  return (
    <button
      onClick={onSelect}
      className="text-neutral-text-default hover:text-neutral-text-strong bg-neutral-surface-bold w-full py-2 px-3 flex flex-row items-center justify-between cursor-pointer hover:bg-neutral-surface-strong transition-colors duration-75"
    >
      <span
        className={`text-string-14 ${isSelected ? 'text-neutral-text-strong' : ''}`}
      >
        {label}
      </span>
      {isSelected ? (
        <CircleCheck strokeWidth={1.5} size={16} />
      ) : (
        <Circle strokeWidth={1.5} size={16} />
      )}
    </button>
  );
};

export default DropdownSelect;
