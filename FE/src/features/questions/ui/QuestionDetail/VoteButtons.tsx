import { ArrowBigDown, ArrowBigUp } from 'lucide-react';

const VoteButtons = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <button className="w-9 h-9 items-center justify-center flex bg-neutral-surface-strong text-neutral-text-default rounded-lg cursor-pointer hover:text-brand-text-on-default hover:bg-brand-surface-default/80 transition-colors duration-150">
        <ArrowBigUp className="" strokeWidth={2} size={24} />
      </button>
      <span className="text-neutral-text-default text-display-16">16</span>
      <button className="w-9 h-9 items-center justify-center flex bg-neutral-surface-strong text-neutral-text-default rounded-lg cursor-pointer hover:text-brand-text-on-default hover:bg-brand-surface-default/80 transition-colors duration-150">
        <ArrowBigDown className="" strokeWidth={2} size={24} />
      </button>
    </div>
  );
};

export default VoteButtons;
