import EventsView from "@/components/events/EventsView"; // Import the new view component

export default function GlobalEventsPage() {
  // Wrapped by (global)/layout.tsx -> sets activeSlug = null
  return <EventsView />;
}