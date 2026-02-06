import OrgContextUpdater from '@/components/OrgContextUpdater';

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrgContextUpdater slug={null} />
      {children} 
    </>
  );
}