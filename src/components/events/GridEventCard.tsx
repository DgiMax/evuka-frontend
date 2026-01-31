"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Video, Map, Check } from "lucide-react";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";

export default function GridEventCard({ event }: { event: any }) {
  const { activeSlug } = useActiveOrg();
  const { 
    slug, title, start_time, organizer_name, banner_image, 
    course_title, event_type, is_paid, price, currency, 
    is_registered, is_full, location 
  } = event;

  const eventDetailHref = activeSlug ? `/${activeSlug}/events/${slug}` : `/events/${slug}`;
  const eventDate = new Date(start_time);
  const displayOrganizer = organizer_name || "Organizer";

  return (
    <Link href={eventDetailHref} className="group bg-white border border-gray-200 rounded-md overflow-hidden flex flex-col h-full transition-all hover:border-primary relative">
      <div className="relative aspect-video block bg-gray-50 border-b border-gray-100 overflow-hidden">
        <Image
          src={banner_image || "https://placehold.co/600x400/2694C6/FFFFFF?text=Event"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <div className="bg-black/80 text-[8px] font-black px-1.5 py-0.5 rounded-sm text-white uppercase shadow-sm flex items-center gap-1">
            {event_type === 'online' ? <Video size={10} /> : <Map size={10} />}
            {event_type}
          </div>
          {course_title && (
            <div className="bg-white/95 text-[8px] font-black px-1.5 py-0.5 rounded-sm text-primary uppercase shadow-sm">
              {course_title}
            </div>
          )}
        </div>

        {is_registered && (
          <div className="absolute top-2 right-2 bg-green-600 text-[8px] font-black px-2 py-1 rounded-sm text-white uppercase shadow-lg flex items-center gap-1 z-20">
            <Check size={10} /> Registered
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-white/95 p-1.5 rounded shadow-md flex flex-col items-center min-w-[40px]">
           <span className="text-[10px] font-black text-primary uppercase leading-none">{eventDate.toLocaleString('en-US', { month: 'short' })}</span>
           <span className="text-sm font-black text-gray-900 leading-none mt-0.5">{eventDate.getDate()}</span>
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-black text-[14px] leading-tight text-gray-900 line-clamp-2 group-hover:text-primary transition-colors uppercase tracking-tight mb-2">
          {title}
        </h3>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase">
            <CalendarDays size={12} className="text-primary" />
            {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase truncate">
            <MapPin size={12} className="text-primary" />
            {location || event_type}
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
          <p className="font-black text-[13px] text-gray-900">
            {is_paid ? `${currency} ${parseFloat(price).toLocaleString()}` : "FREE"}
          </p>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              By {displayOrganizer}
          </span>
        </div>
      </div>
    </Link>
  );
}