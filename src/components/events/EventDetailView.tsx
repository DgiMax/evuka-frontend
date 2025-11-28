"use client";

import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import React, { useState, useEffect } from "react";
import { EventActions } from "@/components/events/EventActions";
import { EventAgenda } from "@/components/events/EventAgenda";
import { RelatedCourseCard } from "@/components/events/RelatedCourseCard";
import { CalendarDaysIcon, MapPinIcon, Clock3Icon, UsersIcon } from "lucide-react";
import api from "@/lib/api/axios";
import EventDetailSkeleton from "@/components/skeletons/EventDetailSkeleton";
import { useAuth } from "@/context/AuthContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";

// --- TYPE (Unchanged) ---
export type EventDetails = {
  id: number;
  slug: string;
  title: string;
  overview: string;
  description: string;
  event_type: string;
  location: string;
  meeting_link?: string;
  start_time: string;
  end_time: string;
  timezone: string;
  who_can_join: string;
  banner_image: string;
  is_paid: boolean;
  price: string;
  currency: string;
  max_attendees: number;
  registration_open: boolean;
  registration_deadline: string;
  course?: {
    slug: string;
    title: string;
    price: string;
    rating_avg: number;
    num_ratings: number;
    thumbnail: string;
  };
  organizer_name: string;
  registrations_count: number;
  is_full: boolean;
  is_registered: boolean;
  attachments: { id: number; file: string; uploaded_by: string; uploaded_at: string }[];
  agenda: { id: number; time: string; title: string; description: string; order: number }[];
  learning_objectives: { id: number; text: string }[];
  rules: { id: number; title: string; text: string }[];
  created_at: string;
  updated_at: string;
};

// --- SUB-COMPONENTS (Unchanged) ---
const StickySidebar = ({ event }: { event: EventDetails }) => (
  <div className="sticky top-2">
    <div className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
      <p className="text-xs text-gray-500">
        Updated {new Date(event.updated_at).toLocaleDateString()}
      </p>
      {/* ... rest of StickySidebar JSX ... */}
      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <p className="flex items-center">
          <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-600" />
          {new Date(event.start_time).toLocaleDateString()} —{" "}
          {new Date(event.end_time).toLocaleDateString()}
        </p>
        <p className="flex items-center">
          <Clock3Icon className="w-4 h-4 mr-2 text-gray-600" />
          {new Date(event.start_time).toLocaleTimeString()} ({event.timezone})
        </p>
        <p className="flex items-center">
          <MapPinIcon className="w-4 h-4 mr-2 text-gray-600" /> {event.location || event.event_type}
        </p>
        <p className="flex items-center">
          <UsersIcon className="w-4 h-4 mr-2 text-gray-600" />{" "}
          {event.registrations_count}/{event.max_attendees || 'Unlimited'} attending
        </p>
      </div>
      {event.is_paid ? (
        <p className="text-3xl font-bold text-gray-900 mt-4 mb-4">
          {event.currency} {event.price}
        </p>
      ) : (
        <p className="text-lg font-semibold text-green-600 mt-4 mb-4">Free Event</p>
      )}
      <EventActions event={event} />
    </div>
  </div>
);

const EventDescription = ({ html }: { html: string }) => (
  <div className="prose prose-gray max-w-none text-gray-700">
    <h2 className="text-2xl font-bold mb-4 text-gray-900">About this Event</h2>
    {/* Use a proper markdown renderer if description is markdown */}
    <div dangerouslySetInnerHTML={{ __html: html || "No description available." }} />
  </div>
);


export default function EventDetailView() { // ✅ Renamed component
  const params = useParams();
  const slug = params.slug as string;
  const { activeSlug } = useActiveOrg(); // ✅ Get active context

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (slug && !authLoading) {
      const fetchEventDetails = async () => {
        setLoading(true);
        setError(null);
        setEvent(null); // Clear previous data

        try {
          // ✅ Use context-aware API client
          // Interceptor adds X-Organization-Slug header
          const res = await api.get(`/events/${slug}/`);
          setEvent(res.data);
        } catch (err: any) {
          console.error("Failed to fetch event:", err);
           if (err.response && err.response.status === 404) {
             setError("Event not found in this context.");
          } else {
             setError("Failed to load event details.");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchEventDetails();
    }
    // ✅ Add activeSlug to dependency array
  }, [slug, user, authLoading, activeSlug]);

  if (loading || authLoading) {
    return <EventDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white text-gray-800 font-sans min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!event) {
    // This case might be hit if the API call succeeded but returned no data,
    // or if the error wasn't caught properly. Adding a fallback.
    return (
      <div className="bg-white text-gray-800 font-sans min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Event details could not be loaded.</p>
      </div>
    );
  }


  return (
    <div className="bg-white text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 xl:gap-x-10">
          {/* Sidebar */}
          <aside className="mt-2 lg:mt-0 order-2 lg:order-1">
            <StickySidebar event={event} />
          </aside>

          {/* Main */}
          <main className="lg:col-span-2 order-1 lg:order-2">
            <div className="aspect-video bg-gray-100 rounded-md mb-6 overflow-hidden">
              <Image
                src={event.banner_image || "/placeholder.jpg"}
                alt={event.title}
                width={1280}
                height={720}
                className="w-full h-full object-cover rounded-md"
                priority // Load image sooner
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {event.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {event.overview || "No overview available."}
            </p>

            <p className="text-sm text-gray-500 mb-6">
              Organizer:{" "}
              <span className="font-semibold text-[#2694C6]">
                {event.organizer_name || 'Unknown'}
              </span>{" "}
              | Type: <span className="capitalize">{event.event_type}</span>
            </p>

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="border border-gray-200 rounded p-6 my-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Event Agenda
                </h2>
                <EventAgenda agenda={event.agenda} />
              </div>
            )}

            {/* Learning Objectives */}
            {event.learning_objectives && event.learning_objectives.length > 0 && (
              <div className="border border-gray-200 rounded p-6 my-8">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Learning Objectives
                </h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {event.learning_objectives.map((obj) => (
                    <li key={obj.id}>{obj.text}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rules */}
            {event.rules && event.rules.length > 0 && (
               <div className="border border-gray-200 rounded p-6 my-8">
                 <h2 className="text-xl font-bold mb-4 text-gray-900">
                   Event Rules
                 </h2>
                 <ul className="list-disc pl-5 text-gray-700 space-y-2">
                   {event.rules.map((rule) => (
                     <li key={rule.id}>
                       <strong>{rule.title}: </strong>
                       {rule.text}
                     </li>
                   ))}
                 </ul>
               </div>
            )}


            {/* Description */}
            <EventDescription html={event.description} />

            {/* Related Course */}
            {event.course && (
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Related Course:</h2>
                {/* Ensure RelatedCourseCard handles potential undefined course */}
                <RelatedCourseCard course={event.course} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}