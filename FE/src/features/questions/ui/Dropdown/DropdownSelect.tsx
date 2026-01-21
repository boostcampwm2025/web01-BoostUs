import { Circle, CircleCheck } from 'lucide-react';

const DropdownSelect = ({
  isSelected,
  label,
}: {
  isSelected: boolean;
  label: string;
}) => {
  return (
    <button className="text-neutral-text-default hover:text-neutral-text-strong bg-neutral-surface-bold w-full py-2 px-3 flex flex-row items-center justify-between cursor-pointer hover:bg-neutral-surface-strong transition-colors duration-75">
      <span
        className={`text-string-14 ${isSelected ? 'text-neutral-text-strong' : ''}`}
      >
        {label}
      </span>
      {isSelected ? (
        <CircleCheck strokeWidth={1} size={16} />
      ) : (
        <Circle strokeWidth={1} size={16} />
      )}
    </button>
  );
};

export default DropdownSelect;
