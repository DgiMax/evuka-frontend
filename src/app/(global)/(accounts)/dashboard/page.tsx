import DashboardView from "@/components/features/DashboardView";
import OrgContextUpdater from "@/components/OrgContextUpdater";

export default function PersonalDashboardPage() {
  return (
    <>
      <OrgContextUpdater slug={null} />
      <DashboardView slug={null} />
    </>
  );
}