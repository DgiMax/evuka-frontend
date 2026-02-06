"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Calendar, MapPin, Ticket, ExternalLink, Info, ListChecks, ShieldAlert, Clock, Target, CheckCircle2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import api from "@/lib/api/axios";
import { toast } from "sonner";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { cn } from "@/lib/utils";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string | null;
}

export function EventDetailModal({ isOpen, onClose, slug }: EventDetailModalProps) {
    const router = useRouter();
    const { activeSlug } = useActiveOrg();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isOpen && slug) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/events/registered-events/${slug}/`);
          setEvent(res.data);
        } catch (err) {
          toast.error("Failed to load event details.");
          onClose();
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    } else {
      setEvent(null);
    }
  }, [isOpen, slug, onClose]);

  const handleDownloadTicket = async () => {
    try {
      const response = await api.get(`/events/registered-events/${slug}/ticket/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Ticket-${slug}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to download ticket.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:max-w-[640px] lg:max-w-[720px] p-0 gap-0 max-h-[95vh] md:max-h-[90vh] min-h-[600px] flex flex-col border-border/80 shadow-2xl rounded-md bg-background overflow-hidden [&>button]:hidden transition-all duration-300 top-[5%] md:top-[5%] translate-y-0 left-1/2 -translate-x-1/2 outline-none">
        
        <DialogHeader className="px-4 py-3 md:py-4 border-b bg-muted/50 flex flex-row items-center justify-between shrink-0 backdrop-blur-sm z-10">
          <DialogTitle className="text-[13px] md:text-lg font-black tracking-tighter text-foreground flex items-center gap-2 uppercase">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            {loading ? "Syncing..." : "Event Details"}
          </DialogTitle>
          <DialogClose className="rounded-md p-1.5 md:p-2 hover:bg-muted transition">
            <X className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground hover:text-foreground" />
          </DialogClose>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {loading ? (
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
              <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
                <Skeleton height={280} borderRadius={8} className="w-full" />
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton width={120} height={10} />
                    <Skeleton width={60} height={15} />
                  </div>
                  <Skeleton width="80%" height={30} />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton height={50} borderRadius={8} />
                    <Skeleton height={50} borderRadius={8} />
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                  <Skeleton width={100} height={12} />
                  <Skeleton count={4} />
                </div>
              </SkeletonTheme>
            </div>
          ) : event ? (
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-8 space-y-6 md:space-y-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-track]:bg-transparent">
              
              <div className="aspect-[16/9] md:aspect-video relative rounded-md overflow-hidden bg-gray-100 border border-gray-100 shrink-0 shadow-sm">
                 <Image src={event.banner_image || "/placeholder.svg"} alt="" fill className="object-cover" priority />
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[9px] md:text-[10px] font-black text-[#2694C6] uppercase tracking-[0.2em]">{event.course?.title || "Exclusive Event"}</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded-[4px] text-[8px] md:text-[9px] font-black uppercase tracking-widest">{event.event_type}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-[4px] text-[8px] md:text-[9px] font-black uppercase tracking-widest",
                      event.is_paid ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    )}>
                      {event.is_paid ? `${event.currency} ${event.price}` : "Free Pass"}
                    </span>
                  </div>
                </div>

                <h2 className="text-lg md:text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">{event.title}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                      <Clock size={16} className="text-primary" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Schedule</span>
                      <span className="text-[11px] md:text-xs font-bold text-gray-700 truncate">
                        {new Date(event.start_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} @ {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100/50">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                      <MapPin size={16} className="text-[#2694C6]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Location</span>
                      <span className="text-[11px] md:text-xs font-bold text-gray-700 truncate">{event.location || "Virtual Venue"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {event.overview && (
                <div className="space-y-3">
                  <h4 className="text-[10px] md:text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                     <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Overview
                  </h4>
                  <p className="text-[13px] md:text-sm text-gray-600 leading-relaxed font-medium">{event.overview}</p>
                </div>
              )}

              {event.learning_objectives?.length > 0 && (
                <div className="space-y-4">
                   <h4 className="text-[10px] md:text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <Target size={14} className="text-primary" /> Learning Goals
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {event.learning_objectives.map((obj: any) => (
                        <div key={obj.id} className="flex items-start gap-2.5 p-3 rounded-md bg-primary/5 border border-primary/10">
                           <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                           <span className="text-[11px] md:text-[12px] font-bold text-gray-700 leading-tight">{obj.text}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {event.agenda?.length > 0 && (
                <div className="space-y-5">
                  <h4 className="text-[10px] md:text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                     <ListChecks size={14} className="text-[#2694C6]" /> Detailed Agenda
                  </h4>
                  <div className="space-y-0 border-l border-gray-200 ml-2">
                    {event.agenda.map((item: any) => (
                      <div key={item.id} className="relative pl-6 pb-6 last:pb-0">
                        <div className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-white border-2 border-[#2694C6]" />
                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                          <h5 className="text-[12px] md:text-[13px] font-black text-gray-800 uppercase leading-none">{item.title}</h5>
                          <span className="text-[9px] font-black text-[#2694C6] uppercase bg-[#2694C6]/5 px-2 py-0.5 rounded tracking-tighter w-fit">{item.time}</span>
                        </div>
                        {item.description && <p className="text-[11px] md:text-[12px] text-gray-500 font-bold mt-1.5 leading-snug">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.rules?.length > 0 && (
                <div className="p-4 md:p-5 bg-rose-50/50 rounded-xl border border-rose-100 space-y-4">
                   <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                      <ShieldAlert size={16} /> Important Guidelines
                   </h4>
                   <div className="grid grid-cols-1 gap-3">
                      {event.rules.map((rule: any) => (
                        <div key={rule.id} className="flex gap-3 items-start">
                           <div className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                           <div className="flex flex-col">
                              <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{rule.title}</span>
                              <span className="text-[11px] text-gray-600 font-bold leading-tight">{rule.text}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-20 px-6">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Info size={32} className="opacity-20" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-center">Connection timeout or no data</p>
            </div>
          )}
        </div>

        <div className="px-4 md:px-6 py-3 md:py-4 border-t bg-background shrink-0 mt-auto flex flex-col-reverse sm:flex-row sm:justify-end gap-2 md:gap-3">
          {event?.has_ticket && (
            <Button 
              variant="outline" 
              onClick={handleDownloadTicket} 
              className="h-10 md:h-11 w-full sm:w-auto px-6 text-[10px] md:text-[11px] font-black uppercase tracking-widest border-gray-200 shadow-none hover:bg-gray-50"
            >
              <Ticket className="mr-2 h-4 w-4" /> Download Ticket
            </Button>
          )}
          {event?.can_join ? (
             <Button 
                onClick={() => {
                    if (event.chat_room_id) {
                    const basePath = activeSlug ? `/${activeSlug}` : '';
                    router.push(`${basePath}/live-events/${event.slug}`);
                    } else if (event.meeting_link) {
                    window.open(event.meeting_link, '_blank');
                    } else {
                    toast.error("No meeting link or chat room has been set up for this event.");
                    }
                }} 
                disabled={!event.chat_room_id && !event.meeting_link}
                className={cn(
                    "h-10 md:h-11 w-full sm:w-auto px-8 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all active:scale-95",
                    (!event.chat_room_id && !event.meeting_link) 
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-none"
                )}
                >
                <ExternalLink className="mr-2 h-4 w-4" /> 
                {event.chat_room_id 
                    ? "Launch Studio" 
                    : event.meeting_link 
                    ? "Enter External Session" 
                    : "No Session Available"}
            </Button>
          ) : (
             <Button 
               onClick={onClose} 
               className="h-10 md:h-11 w-full sm:w-auto px-10 text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-none bg-primary hover:bg-primary/90"
             >
               Dismiss
             </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}