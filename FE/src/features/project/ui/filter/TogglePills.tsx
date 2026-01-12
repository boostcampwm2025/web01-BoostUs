import TogglePill from '@/shared/ui/TogglePill';

export default function TogglePills({ sort }: { sort: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sort.map((item) => (
        <TogglePill key={item} title={item} />
      ))}
    </div>
  );
}
