"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import EventCardComponent from "@/components/cards/EventCardComponent";
import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";

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
  <div className="col-span-full mx-auto w-full lg:w-3/4">
    <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg bg-muted/50 p-4">
      <Inbox className="h-8 w-8 text-muted-foreground" />
      <p className="text-muted-foreground mt-2 text-center text-sm">{message}</p>
    </div>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-4 border rounded-lg shadow-sm">
          <Skeleton height={160} className="mb-4" />
          <Skeleton height={20} width="90%" className="mb-2" />
          <Skeleton count={2} className="mb-1" />
          <Skeleton height={16} width="60%" className="mt-3 mb-4" />
          <Skeleton height={36} />
        </div>
      ))}
    </div>
  </SkeletonTheme>
);

export default function EventsCommunitySection() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { activeSlug } = useActiveOrg();

  const fetchUpcomingEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setEvents([]);

    try {
      const config = activeSlug
        ? { headers: { "X-Organization-Slug": activeSlug } }
        : {};

      const response = await api.get("/upcoming-events/", config);

      const list = Array.isArray(response.data)
        ? response.data.slice(0, 3)
        : [];

      setEvents(list);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setEvents([]);
      } else {
        console.error("Error fetching events:", err);
        setError("Failed to load community events.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeSlug]);

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
    <section className="py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2 leading-tight">
          Upcoming Community Events
        </h4>
        <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
          Where learning meets culture and real-world connection.
        </p>

        <div className="flex justify-center mb-12 w-full">
          <div className="w-full max-w-6xl">
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <EmptyState message={error} />
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCardComponent
                    key={event.slug}
                    {...formatEventForCard(event)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No upcoming public events scheduled yet." />
            )}
          </div>
        </div>

        {!isLoading && (
          <div className="mt-12 flex justify-center">
            <Link
              href="/community"
              className="inline-block bg-primary text-primary-foreground font-semibold text-lg py-3 px-12 rounded hover:bg-primary/90 transition duration-200"
            >
              Explore All Events
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
