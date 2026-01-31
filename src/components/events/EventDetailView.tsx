"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { EventActions } from "@/components/events/EventActions";
import { EventAgenda } from "@/components/events/EventAgenda";
import api from "@/lib/api/axios";
import { cn } from "@/lib/utils";
import { 
  ChevronDown, ChevronUp, PlayCircle, CalendarDays, MapPin, 
  Users, Target, ShieldCheck, ArrowLeft, CheckCircle2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const EventStickySidebar = ({ event }: { event: any }) => (
  <div className="relative lg:sticky lg:top-20 border-2 border-border rounded-md bg-card overflow-hidden w-full">
    <div className="aspect-video bg-muted relative border-b border-border flex items-center justify-center group">
      {event?.banner_image ? (
        <Image src={event.banner_image} alt="Banner" fill className="object-cover" />
      ) : (
        <PlayCircle className="h-10 w-10 text-muted-foreground/20" />
      )}
    </div>
    
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-2xl md:text-3xl font-black text-foreground">
          {event?.is_paid ? `${event.currency} ${Number(event.price).toLocaleString()}` : 'Free'}
        </h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#2694C6]">
          Guaranteed Entry Access
        </p>
      </div>

      <EventActions event={event} />
    </div>
  </div>
);

export default function EventDetailView() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { activeSlug } = useActiveOrg();
  
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openRuleIndex, setOpenRuleIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/events/${slug}/`);
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug, activeSlug]);

  if (loading) return <EventDetailSkeleton />;

  const isLongDescription = (event?.description?.length || 0) > 800;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-[#1C1D1F] text-white pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="group flex items-center gap-2 text-gray-400 hover:text-white p-0 hover:bg-transparent font-black uppercase text-[10px] tracking-widest transition-all"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>
          </div>
          <div className="lg:w-2/3 space-y-4">
            <Badge className="bg-[#2694C6] text-white rounded-sm border-none font-black text-[10px] uppercase px-3 py-1">
              {event?.event_type} Event
            </Badge>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {event?.title}
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 font-normal max-w-3xl leading-relaxed">
              {event?.overview}
            </p>
            
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Event Date</span>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CalendarDays size={16} className="text-[#2694C6]" />
                    <span>{new Date(event?.start_time).toLocaleDateString()}</span>
                  </div>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Location</span>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <MapPin size={16} className="text-[#2694C6]" />
                    <span className="capitalize">{event?.location || event?.event_type}</span>
                  </div>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Organized By</span>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Users size={16} className="text-[#2694C6]" />
                    <span>{event?.organizer_name}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          <aside className="order-1 lg:order-2 lg:col-span-1 mt-6 lg:-mt-64 z-10 w-full max-w-md lg:max-w-none mx-auto lg:mx-0">
            <EventStickySidebar event={event} />
          </aside>

          <main className="order-2 lg:order-1 lg:col-span-2 py-8 space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 border border-border rounded-md bg-card">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Capacity</p>
                  <p className="text-sm font-bold">{event?.registrations_count} / {event?.max_attendees || "∞"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Start Time</p>
                  <p className="text-sm font-bold">{new Date(event?.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Registration</p>
                  <p className="text-sm font-bold">{event?.registration_open ? 'OPEN' : 'CLOSED'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Access</p>
                  <p className="text-sm font-bold capitalize">{event?.who_can_join?.replace('_', ' ')}</p>
                </div>
            </div>

            <div className="border border-border rounded-md p-5 md:p-8 bg-card">
              <h2 className="text-lg md:text-xl font-black text-foreground mb-6 uppercase tracking-widest flex items-center gap-3">
                <Target size={20} className="text-[#2694C6]" /> What to expect
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event?.learning_objectives?.map((obj: any) => (
                  <div key={obj.id} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#2694C6] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-muted-foreground leading-relaxed">{obj.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-black text-foreground uppercase tracking-widest border-b border-border pb-4">Itinerary</h2>
              <EventAgenda agenda={event?.agenda || []} />
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-black text-foreground uppercase tracking-widest border-b border-border pb-4">About the Event</h2>
              <div className="relative">
                <div className={cn(
                    "prose prose-sm max-w-none text-muted-foreground font-medium leading-relaxed transition-all duration-500 ease-in-out",
                    !isExpanded && isLongDescription ? "max-h-60 overflow-hidden" : "max-h-[2000px]"
                )}>
                  <ReactMarkdown>{event?.description || "No description provided."}</ReactMarkdown>
                </div>
                {!isExpanded && isLongDescription && (
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
                )}
              </div>
              {isLongDescription && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 text-[#2694C6] font-black uppercase text-[11px] tracking-widest transition-colors group">
                  {isExpanded ? (
                    <>Show Less <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" /></>
                  ) : (
                    <>Read More <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" /></>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-8">
               <h2 className="text-xl font-black text-foreground uppercase tracking-widest border-b border-border pb-4">Guidelines</h2>
               <div className="divide-y divide-border border-y border-border">
                  {event?.rules?.map((rule: any, idx: number) => {
                    const isOpen = openRuleIndex === idx;
                    return (
                      <div key={rule.id} className="group">
                        <button onClick={() => setOpenRuleIndex(isOpen ? null : idx)} className="w-full flex items-center justify-between py-5 px-2 text-left">
                          <div className="flex items-center gap-4">
                            <ShieldCheck size={20} className={cn("transition-colors", isOpen ? "text-[#2694C6]" : "text-gray-400")} />
                            <span className="font-bold text-sm uppercase tracking-wider">{rule.title}</span>
                          </div>
                          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                        </button>
                        <div className={cn("overflow-hidden transition-all duration-300", isOpen ? "max-h-96 opacity-100 pb-6 pl-12" : "max-h-0 opacity-0")}>
                            <p className="text-sm text-muted-foreground leading-relaxed pr-8">{rule.text}</p>
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            {event?.course && (
              <div className="space-y-6 pt-6">
                <h2 className="text-lg font-black text-foreground uppercase tracking-widest">Linked Curriculum</h2>
                <div className="flex items-center gap-6 p-6 rounded-md border-2 border-border bg-card max-w-xl group hover:border-[#2694C6] transition-colors cursor-pointer" onClick={() => router.push(`/courses/${event.course.slug}`)}>
                   <div className="h-20 w-32 bg-muted rounded-none overflow-hidden shrink-0 relative">
                     <Image src={event.course.thumbnail || "/placeholder.jpg"} alt="" fill className="object-cover" />
                   </div>
                   <div className="min-w-0">
                      <h4 className="font-black text-foreground text-base truncate group-hover:text-[#2694C6] transition-colors">{event.course.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Visit Course Page</p>
                   </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

const EventDetailSkeleton = () => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
    <div className="min-h-screen bg-white">
      <div className="bg-[#1C1D1F] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:w-2/3 space-y-6">
            <Skeleton width={120} height={20} />
            <Skeleton height={60} width="85%" />
            <Skeleton height={30} width="70%" />
            <div className="flex gap-8 pt-4">
              <Skeleton width={120} height={45} />
              <Skeleton width={120} height={45} />
              <Skeleton width={120} height={45} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-12">
          <aside className="order-1 lg:order-2 lg:col-span-1 mt-6 lg:-mt-64 z-10">
            <div className="border-2 border-border rounded-md bg-white overflow-hidden">
               <Skeleton height={200} />
               <div className="p-6 space-y-6">
                  <Skeleton height={40} width="60%" />
                  <Skeleton height={50} width="100%" />
               </div>
            </div>
          </aside>

          <main className="order-2 lg:order-1 lg:col-span-2 py-10 space-y-12">
            <Skeleton height={100} borderRadius={4} />
            <Skeleton height={200} borderRadius={4} />
            <div className="space-y-4">
              <Skeleton width={200} height={30} />
              <Skeleton count={4} height={50} borderRadius={0} />
            </div>
            <div className="space-y-4">
              <Skeleton width={200} height={30} />
              <Skeleton height={250} />
            </div>
          </main>
        </div>
      </div>
    </div>
  </SkeletonTheme>
);