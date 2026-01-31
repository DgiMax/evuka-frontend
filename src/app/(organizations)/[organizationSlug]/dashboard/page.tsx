import DashboardView from "@/components/features/DashboardView";

export default async function OrganizationalDashboardPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;

  return <DashboardView slug={organizationSlug} />;
}