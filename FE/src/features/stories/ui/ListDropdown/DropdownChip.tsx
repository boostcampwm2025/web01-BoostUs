interface DropdownChipProps {
  onClick: () => void;
  isActive: boolean;
  label: string;
}

const DropdownChip = ({ onClick, isActive, label }: DropdownChipProps) => {
  return (
    <button
      onClick={onClick}
      className={`${isActive ? 'bg-accent-blue text-neutral-surface-bold' : 'bg-neutral-surface-default text-neutral-text-weak'} text-string-14 h-7 w-full cursor-pointer rounded-lg transition-colors duration-200`}
    >
      {label}
    </button>
  );
};

export default DropdownChip;
