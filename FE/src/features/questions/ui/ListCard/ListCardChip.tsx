const ListCardChip = ({ tag }: { tag: string }) => {
  return (
    <div className="flex items-center justify-center px-2 py-1 border rounded-full border-neutral-border-default bg-neutral-surface-strong">
      <span className="text-body-12 text-neutral-text-weak">{tag}</span>
    </div>
  );
};

export default ListCardChip;
