import EventDetailView from "@/components/events/EventDetailView";

export default function GlobalEventDetailPage() {
  // Wrapped by (global)/layout.tsx -> sets activeSlug = null
  return <EventDetailView />;
}