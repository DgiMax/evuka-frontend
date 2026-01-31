import AnnouncementsListClient from "@/components/announcements/AnnouncementsListClient";
import OrgContextUpdater from "@/components/OrgContextUpdater";

export default function PersonalAnnouncementsPage() {
  return (
    <>
      <OrgContextUpdater slug={null} />
      <AnnouncementsListClient key="personal" slug={null} />
    </>
  );
}