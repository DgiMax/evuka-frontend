"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Ticket, Video, Loader2, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/context/CartContext";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { EventTicketModal } from "./EventTicketModal";
import api from "@/lib/api/axios";
import { cn } from "@/lib/utils";

export function EventActions({ event }: { event: any }) {
  const { addToCart } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isJoinActive, setIsJoinActive] = useState(false);
  const [timeUntilJoin, setTimeUntilJoin] = useState("");

  const displayOrganizer = event?.organizer_name || "Organizer";

  useEffect(() => {
    if (event?.is_registered && event?.event_type !== 'physical') {
      const checkActivation = () => {
        const now = new Date();
        const startTime = new Date(event.start_time);
        const activationTime = new Date(startTime.getTime() - 60 * 60 * 1000);
        
        if (now >= activationTime) {
          setIsJoinActive(true);
        } else {
          const diff = activationTime.getTime() - now.getTime();
          const mins = Math.floor(diff / 60000);
          const hours = Math.floor(mins / 60);
          setTimeUntilJoin(hours > 0 ? `${hours}h ${mins % 60}m` : `${mins}m`);
        }
      };

      checkActivation();
      const timer = setInterval(checkActivation, 60000);
      return () => clearInterval(timer);
    }
  }, [event]);

  const handleDownloadTicket = async () => {
    setIsDownloading(true);
    try {
      const response = await api.get(`/events/${event.slug}/ticket/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Ticket_${event.slug}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Ticket downloaded successfully");
    } catch (err) {
      toast.error("Failed to generate ticket PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddToCart = () => {
    const item: CartItem = {
      type: "event",
      slug: event.slug,
      title: event.title,
      instructor_name: displayOrganizer,
      price: `${event.currency} ${event.price}`,
      priceValue: parseFloat(event.price) || 0,
      thumbnail: event.banner_image,
    };
    addToCart(item);
    toast.success(`${event.title} added to cart`);
  };

  const handleRegister = async () => {
    if (!event?.is_paid) {
      setLoading(true);
      try {
        await api.post(`/events/registered-events/${event.slug}/register/`);
        toast.success("Successfully registered!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.response?.data?.detail || "Registration failed");
      } finally {
        setLoading(false);
      }
      return;
    }

    handleAddToCart();
    router.push("/cart");
  };

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events/registered-events/${event.slug}/join/`);
      if (res.data.type === 'external') {
        window.open(res.data.url, '_blank');
      } else if (res.data.type === 'native') {
        router.push(`/events/live/${event.slug}?token=${res.data.token}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  if (event?.is_registered) {
    return (
      <div className="space-y-4">
        {/* Physical or Hybrid Ticket Action */}
        {(event.event_type === 'physical' || event.event_type === 'hybrid') && (
          <Button 
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-black uppercase text-[11px] tracking-widest flex items-center gap-2"
            onClick={() => setTicketModalOpen(true)}
          >
            <Ticket size={16} /> Get Entry Ticket
          </Button>
        )}

        {/* Online or Hybrid Join Action */}
        {(event.event_type === 'online' || event.event_type === 'hybrid') && (
          <div className="space-y-3">
            <Button 
              disabled={!isJoinActive || loading}
              onClick={handleJoin}
              className={cn(
                "w-full h-12 font-black uppercase text-[11px] tracking-widest flex items-center gap-2 shadow-none transition-all",
                isJoinActive ? "bg-[#2694C6] hover:bg-[#1e7ca8] text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Video size={16} /> Join Live Meeting</>}
            </Button>
            
            {!isJoinActive && (
              <div className="bg-amber-50 border border-amber-100 rounded-md p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-1 duration-500">
                <CalendarClock size={18} className="text-amber-600 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Waiting for room</p>
                  <p className="text-[11px] text-amber-800 font-bold leading-tight">
                    The virtual meeting room will automatically activate in <span className="text-amber-600">{timeUntilJoin}</span>.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <EventTicketModal 
          isOpen={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
          onDownload={handleDownloadTicket}
          eventTitle={event.title}
          isDownloading={isDownloading}
        />
      </div>
    );
  }

  if (event?.is_full) {
    return (
      <Button disabled className="w-full h-12 bg-muted text-muted-foreground font-black uppercase text-[11px] tracking-widest">
        Event Fully Booked
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Button 
        disabled={loading}
        onClick={handleRegister}
        className="w-full h-12 bg-[#2694C6] hover:bg-[#1e7ca8] text-white font-black uppercase text-[11px] tracking-widest shadow-none"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Register Now"}
      </Button>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={handleAddToCart}
          className="flex-grow h-12 border-2 border-gray-900 text-gray-900 bg-white font-black uppercase text-[11px] tracking-widest hover:bg-gray-50 shadow-none transition-all active:scale-[0.98]"
        >
          Add to Cart
        </Button>
        <WishlistButton slug={event.slug} type="event" />
      </div>
    </div>
  );
}