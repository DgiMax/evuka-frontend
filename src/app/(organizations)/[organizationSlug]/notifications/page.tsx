import GlobalNotificationFeedClient from "@/components/notifications/GlobalNotificationFeedClient";

export default async function OrganizationalNotificationsPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.organizationSlug;

  return <GlobalNotificationFeedClient key={slug} slug={slug} />;
}