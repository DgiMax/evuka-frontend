import GlobalNotificationFeedClient from "@/components/notifications/GlobalNotificationFeedClient";
import OrgContextUpdater from "@/components/OrgContextUpdater";

export default function PersonalNotificationsPage() {
  return (
    <>
      <OrgContextUpdater slug={null} />
      <GlobalNotificationFeedClient key="personal" slug={null} />
    </>
  );
}