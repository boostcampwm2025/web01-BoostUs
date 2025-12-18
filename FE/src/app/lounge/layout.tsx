import { LoungeTabs } from '@/widgets/lounge-tabs/ui/LoungeTabs';

export default function LoungeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <LoungeTabs />
      {children}
    </div>
  );
}
