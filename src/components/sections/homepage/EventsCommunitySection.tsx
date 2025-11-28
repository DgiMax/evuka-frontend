"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import { Inbox, Loader2 } from 'lucide-react';
import EventCardComponent from "@/components/cards/EventCardComponent";
import api from '@/lib/api/axios';
import { useActiveOrg } from '@/lib/hooks/useActiveOrg';

// --- Types ---
interface EventData {
  slug: string;
  title: string;
  description: string;
  banner_image: string | null;
  start_time: string;
  location: string;
  event_type: string;
  // Optional fields for future use (badges, price tags, etc.)
  is_paid?: boolean;
  price?: string;
  currency?: string;
}

interface EmptyStateProps {
  message: string;
}

// --- Empty State Component ---
const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg bg-muted/50 p-4 max-w-lg mx-auto">
    <Inbox className="h-8 w-8 text-muted-foreground" />
    <p className="text-muted-foreground mt-2 text-center text-sm">{message}</p>
  </div>
);

// --- Main Component ---
export default function EventsCommunitySection() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the current organization slug (if any)
  const { activeSlug } = useActiveOrg();

  // 1. Stable Fetch Function
  // We include 'activeSlug' in dependencies so it recreates if the user switches orgs
  const fetchBestUpcomingEvent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setEvent(null);
    try {
      // Pass the organization header if we are in an org context
      const config = activeSlug 
        ? { headers: { "X-Organization-Slug": activeSlug } } 
        : {};

      // Call the dedicated standalone endpoint
      const response = await api.get("/best-upcoming-events/", config);
      setEvent(response.data);
    } catch (err: any) {
      // 404 is valid (no upcoming events found), so we just set event to null
      if (err.response?.status === 404) {
        setEvent(null);
      } else {
        console.error("Error fetching best event:", err);
        setError("Failed to load featured event.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeSlug]); 

  // 2. Effect Trigger
  // Only depends on the fetch function (which is stable unless activeSlug changes)
  useEffect(() => {
    fetchBestUpcomingEvent();
  }, [fetchBestUpcomingEvent]);

  // Helper to map API data to Card props
  const formatEventForCard = (e: EventData) => {
    const date = new Date(e.start_time);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const locationText = e.event_type === 'online' ? 'Online Only' : e.location;

    return {
      title: e.title,
      description: e.description,
      dateLocation: `${formattedDate} – ${locationText}`,
      imageSrc: e.banner_image || "/images.png", // Ensure you have a fallback image in public folder
      buttonHref: `/events/${e.slug}`,
    };
  };

  return (
    <section className="py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        
        <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2 !leading-tight">
          Featured Community Event
        </h4>
        <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
          Where learning meets culture and real-world connection.
        </p>

        <div className="flex justify-center mb-12">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <EmptyState message={error} />
          ) : event ? (
            <div className="max-w-md w-full">
              <EventCardComponent {...formatEventForCard(event)} />
            </div>
          ) : (
            <EmptyState message="No upcoming public events scheduled yet." />
          )}
        </div>

        {event && (
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