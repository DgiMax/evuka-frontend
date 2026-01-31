import AnnouncementsListClient from "@/components/announcements/AnnouncementsListClient";

export default async function OrganizationalAnnouncementsPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.organizationSlug;

  return <AnnouncementsListClient key={slug} slug={slug} />;
}