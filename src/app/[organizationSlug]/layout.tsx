import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import OrgContextUpdater from "@/components/OrgContextUpdater";
import OrgNav from "@/components/layouts/OrgNav";
import api from "@/lib/api/axios";

interface MembershipCheckResponse {
  is_authenticated: boolean;
  is_member: boolean;
  organization_exists: boolean;
}

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const cookieStore = await cookies();

  let status: MembershipCheckResponse | null = null;

  try {
    const response = await api.get(
      `/organizations/check-access/${organizationSlug}/`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );

    status = response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) notFound();
    redirect("/login");
  }

  if (!status) {
    redirect("/login");
  }

  if (!status.organization_exists) notFound();

  if (!status.is_authenticated) {
    redirect(`/login?redirect=/org/${organizationSlug}`);
  }

  if (!status.is_member) {
    redirect(`/organizations/browse/${organizationSlug}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <OrgContextUpdater slug={organizationSlug} />
      <OrgNav />
      <main className="flex-1 p-0 m-0">{children}</main>
    </div>
  );
}