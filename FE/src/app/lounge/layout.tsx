import { LoungeTabs } from '@/widgets/lounge-tabs/ui/LoungeTabs';

export default function LoungeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full max-w-7xl">
      <LoungeTabs />
      {children}
    </div>
  );
}
