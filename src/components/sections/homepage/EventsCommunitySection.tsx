"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import EventCardComponent from "@/components/cards/EventCardComponent";
import api from "@/lib/api/axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface EventData {
  slug: string;
  title: string;
  description: string;
  banner_image: string | null;
  start_time: string;
  location: string;
  event_type: string;
  is_paid?: boolean;
  price?: string;
  currency?: string;
}

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="col-span-full mx-auto w-full">
    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-md bg-muted/30 p-6 shadow-none">
      <Inbox className="h-10 w-10 text-muted-foreground opacity-50" />
      <p className="text-muted-foreground mt-3 text-center text-sm font-medium">{message}</p>
    </div>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="p-0 border border-border rounded-md overflow-hidden bg-card w-full shadow-none"
        >
          <Skeleton height={200} borderRadius={0} />
          <div className="p-5 space-y-3">
            <Skeleton height={24} width="80%" />
            <Skeleton count={2} height={14} />
            <div className="pt-2">
              <Skeleton height={40} borderRadius={6} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </SkeletonTheme>
);

export default function EventsCommunitySection() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/best-upcoming-events");
      const list = Array.isArray(response.data) ? response.data.slice(0, 3) : [];
      setEvents(list);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError("Failed to load community events.");
      }
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  const formatEventForCard = (e: EventData) => {
    const date = new Date(e.start_time);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const locationText = e.event_type === "online" ? "Online Only" : e.location;

    return {
      title: e.title,
      description: e.description,
      dateLocation: `${formattedDate} – ${locationText}`,
      imageSrc: e.banner_image || "/images.png",
      buttonHref: `/events/${e.slug}`,
    };
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-border/40 shadow-none">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h4 className="text-3xl sm:text-4xl font-black text-foreground mb-4 tracking-tight">
            Upcoming Community Events
          </h4>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Where learning meets culture and real-world connection. Connect with experts and peers in our scheduled sessions.
          </p>
        </div>

        <div className="w-full">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <EmptyState message={error} />
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {events.map((event) => (
                <div key={event.slug} className="w-full flex shadow-none">
                  <EventCardComponent {...formatEventForCard(event)} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No upcoming public events scheduled yet. Check back soon!" />
          )}
        </div>

        {!isLoading && (
          <div className="mt-16 flex justify-center px-4">
            <Link
              href="/community"
              className="w-full sm:w-auto text-center bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest py-4 px-12 rounded-md hover:bg-primary/90 transition-all active:scale-95 border border-primary shadow-none"
            >
              Explore All Events
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}