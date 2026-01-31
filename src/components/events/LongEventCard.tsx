"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Video, Map, Clock, ArrowRight, Check } from "lucide-react";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";

export default function LongEventCard({ event }: { event: any }) {
  const { activeSlug } = useActiveOrg();
  const { 
    slug, title, start_time, organizer_name, banner_image, 
    course_title, event_type, is_paid, price, currency,
    is_registered, location
  } = event;

  const eventDetailHref = activeSlug ? `/${activeSlug}/events/${slug}` : `/events/${slug}`;
  const eventDate = new Date(start_time);
  const displayOrganizer = organizer_name || "Organizer";

  return (
    <div className="group flex flex-col sm:flex-row gap-6 p-4 bg-white border border-gray-200 rounded-md hover:border-primary transition-all shadow-sm relative">
      <Link href={eventDetailHref} className="relative w-full sm:w-64 aspect-video shrink-0 overflow-hidden rounded-sm border border-gray-100">
        <Image 
          src={banner_image || "https://placehold.co/600x400/2694C6/FFFFFF?text=Event"} 
          alt={title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        <div className="absolute top-2 left-2 bg-white/95 p-1.5 rounded shadow-md flex flex-col items-center min-w-[42px] border border-gray-100">
           <span className="text-[10px] font-black text-primary uppercase leading-none">{eventDate.toLocaleString('en-US', { month: 'short' })}</span>
           <span className="text-sm font-black text-gray-900 leading-none mt-0.5">{eventDate.getDate()}</span>
        </div>

        <div className="absolute bottom-2 left-2 bg-black/80 text-[8px] font-black px-2 py-0.5 rounded-sm text-white uppercase shadow-sm flex items-center gap-1">
            {event_type === 'online' ? <Video size={10} /> : <Map size={10} />}
            {event_type}
        </div>
      </Link>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1">
               {course_title && (
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest truncate">
                   {course_title}
                 </p>
               )}
               {is_registered && (
                 <span className="flex items-center gap-1 text-[9px] font-black text-green-600 uppercase tracking-widest">
                   <Check size={12} /> Registered
                 </span>
               )}
            </div>
            <Link href={eventDetailHref}>
              <h3 className="font-black text-lg md:text-xl text-gray-900 group-hover:text-primary transition-colors uppercase tracking-tighter leading-tight line-clamp-1">
                {title}
              </h3>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase whitespace-nowrap">
                <Clock size={14} className="text-primary" />
                {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {eventDate.toLocaleDateString()}
            </div>
            
            <span className="hidden md:block text-gray-300">•</span>

            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase truncate">
                <MapPin size={14} className="text-primary" />
                {location || event_type}
            </div>
            </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-lg font-black text-gray-900 tracking-tighter">
              {is_paid ? `${currency} ${parseFloat(price).toLocaleString()}` : "FREE"}
            </p>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
              Hosted by {displayOrganizer}
            </span>
          </div>

          <Link 
            href={eventDetailHref}
            className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest group/link hover:underline"
          >
            Details <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}