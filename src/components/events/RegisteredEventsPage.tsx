"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Calendar, Search, Clock, MapPin, 
  ArrowLeft, Inbox, Radio,
  ChevronDown, Layers, ChevronRight
} from "lucide-react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { useAuth } from "@/context/AuthContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import api from "@/lib/api/axios";
import { cn } from "@/lib/utils";
import { EventDetailModal } from "./EventDetailModal";

export default function RegisteredEventsPage() {
  const { user, loading: authLoading } = useAuth();
  const { activeSlug: orgSlug } = useActiveOrg();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  const [activeEventSlug, setActiveEventSlug] = useState<string | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const fetchEvents = useCallback(async () => {
    setFetching(true);
    try {
      const params = new URLSearchParams();
      if (orgSlug) params.append("active_org", orgSlug);
      if (searchQuery) params.append("search", searchQuery);
      if (dateFilter) params.append("date", dateFilter);

      const res = await api.get(`/events/registered-events/?${params.toString()}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }, [orgSlug, searchQuery, dateFilter]);

  useEffect(() => {
    if (!authLoading && user) fetchEvents();
  }, [fetchEvents, authLoading, user]);

  if (authLoading || (fetching && !data)) return <EventsSkeleton />;

  const groups = data?.groups || { ongoing: [], upcoming: [], past: [] };
  const isDataEmpty = !groups.ongoing.length && !groups.upcoming.length && !groups.past.length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-6xl py-10">
        <div className="flex flex-col gap-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
            <div>
              <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest mb-4">
                <ArrowLeft size={14} /> Back
              </button>
              <div className="flex items-center gap-2 font-black uppercase text-[9px] tracking-[0.3em] text-[#2694C6] mb-1">
                <Calendar size={12} /> {data?.context.label}
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase leading-none text-gray-900">My Events</h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-md py-2.5 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-[#2694C6] w-full md:w-64" 
                />
              </div>
              <input 
                type="date" 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)} 
                className="bg-white border border-gray-200 text-gray-900 rounded-md py-2.5 px-4 text-xs font-bold focus:outline-none focus:border-[#2694C6]" 
              />
            </div>
          </div>

          {isDataEmpty ? (
            <div className="py-32 text-center bg-white rounded-md border-2 border-dashed border-gray-200">
               <Inbox className="mx-auto text-gray-200 mb-4" size={48} />
               <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">No events found</h3>
            </div>
          ) : (
            <div className="space-y-12">
              {groups.ongoing.length > 0 && (
                <section className="bg-white rounded-md border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Radio className="text-emerald-500 animate-pulse" size={20} />
                    <h2 className="text-sm font-black uppercase tracking-tighter text-gray-900">Ongoing Events</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.ongoing.map((event: any) => (
                      <EventCard key={event.slug} event={event} onOpen={() => setActiveEventSlug(event.slug)} />
                    ))}
                  </div>
                </section>
              )}

              {groups.upcoming.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2 px-2">
                     <Layers className="text-gray-400" size={16} />
                     <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Upcoming Schedule</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.upcoming.map((event: any) => (
                      <EventCard key={event.slug} event={event} onOpen={() => setActiveEventSlug(event.slug)} />
                    ))}
                  </div>
                </section>
              )}

              {groups.past.length > 0 && (
                <section className="pt-10 border-t border-gray-200">
                  <button onClick={() => setIsArchiveOpen(!isArchiveOpen)} className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 rounded-md border border-gray-200 transition-all">
                    <div className="flex items-center gap-4 text-gray-500">
                      <Clock size={18} />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Past Events Archive</span>
                    </div>
                    <ChevronDown className={cn("transition-transform", isArchiveOpen && "rotate-180")} size={20} />
                  </button>
                  {isArchiveOpen && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70">
                      {groups.past.map((event: any) => (
                        <div key={event.slug} onClick={() => setActiveEventSlug(event.slug)} className="p-4 bg-white border border-gray-200 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <span className="text-[11px] font-black uppercase tracking-tight text-gray-600">{event.title}</span>
                          <span className="text-[9px] font-bold text-gray-400">{new Date(event.start_time).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      <EventDetailModal 
        isOpen={!!activeEventSlug} 
        onClose={() => setActiveEventSlug(null)} 
        slug={activeEventSlug} 
      />
    </div>
  );
}

function EventCard({ event, onOpen }: { event: any; onOpen: () => void }) {
  return (
    <div onClick={onOpen} className="bg-white border border-gray-100 rounded-md overflow-hidden cursor-pointer transition-all hover:border-[#2694C6]/30 flex flex-col h-full group">
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        <Image src={event.banner_image || "/placeholder.svg"} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur rounded text-[8px] font-black uppercase tracking-widest text-[#2694C6] shadow-sm">
          {event.event_type}
        </div>
      </div>
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <p className="text-[9px] font-black text-[#2694C6] uppercase tracking-widest mb-1">{event.course_title}</p>
          <h3 className="font-bold text-sm text-gray-900 leading-tight uppercase tracking-tight mb-3 line-clamp-1">{event.title}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={12} />
              <span className="text-[9px] font-bold uppercase">{new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(event.start_time).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={12} />
              <span className="text-[9px] font-bold uppercase truncate">{event.location || "Online"}</span>
            </div>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
           <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Details</span>
           <div className="h-6 w-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#2694C6] group-hover:text-white transition-all">
              <ChevronRight size={14} />
           </div>
        </div>
      </div>
    </div>
  );
}

function EventsSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
      <div className="min-h-screen bg-[#F8F9FA] py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <Skeleton height={100} className="mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton height={300} borderRadius={8} />
            <Skeleton height={300} borderRadius={8} />
            <Skeleton height={300} borderRadius={8} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}