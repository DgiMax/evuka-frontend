import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import OrgContextUpdater from "@/components/OrgContextUpdater";
import ContextGate from "@/context/ContextGate";
import OrgNav from "@/components/layouts/OrgNav";
import api from "@/lib/api/axios";
import { RESERVED_SLUGS } from "@/lib/constants";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;

  if (RESERVED_SLUGS.includes(organizationSlug)) {
    return <>{children}</>;
  }

  const cookieStore = await cookies();
  
  let orgExists = true;
  let isAuthenticated = true;

  try {
    const response = await api.get(
      `/organizations/check-access/${organizationSlug}/`,
      {
        headers: { Cookie: cookieStore.toString() },
        validateStatus: (s) => s < 500,
      }
    );

    if (response.data.organization_exists === false) {
      orgExists = false;
    }

    if (response.data.is_authenticated === false) {
      isAuthenticated = false;
    }
  } catch (error) {
    console.error("Layout Access Check Error:", error);
  }

  if (!orgExists) {
    notFound();
  }

  if (!isAuthenticated) {
    redirect(`/login?redirect=${encodeURIComponent(`/${organizationSlug}`)}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <OrgContextUpdater slug={organizationSlug} />
      <ContextGate slug={organizationSlug}>
        <OrgNav />
        <main className="flex-1 p-0 m-0">{children}</main>
      </ContextGate>
    </div>
  );
}