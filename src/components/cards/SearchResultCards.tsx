"use client";

import Link from "next/link";
import { Calendar, Building2, MapPin, Globe, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchCardProps {
  title: string;
  slug: string;
  description?: string;
  image?: string;
  type?: string;
}

export const SearchEventCard = ({ title, slug, description, image }: SearchCardProps) => (
  <Link href={`/events/${slug}`} className="group flex flex-col bg-white border border-border rounded-sm overflow-hidden hover:border-primary transition-all">
    <div className="aspect-video w-full bg-muted overflow-hidden relative">
      {image ? (
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground/20"><Calendar size={32} /></div>
      )}
      <div className="absolute top-2 left-2">
        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest text-primary border border-primary/10">Event</div>
      </div>
    </div>
    <div className="p-4 flex flex-col flex-1">
      <h3 className="font-black text-sm uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed flex-1">{description}</p>
      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Details</span>
        <ArrowUpRight size={14} className="text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </div>
  </Link>
);

export const SearchOrgCard = ({ title, slug, description, image }: SearchCardProps) => (
  <Link href={`/organizations/${slug}`} className="group flex items-center gap-4 p-4 bg-white border border-border rounded-sm hover:border-primary transition-all">
    <div className="w-16 h-16 rounded-sm bg-muted overflow-hidden flex-shrink-0 border border-border">
      {image ? (
        <img src={image} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground/20"><Building2 size={24} /></div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-black text-sm uppercase tracking-tight truncate group-hover:text-primary transition-colors">{title}</h3>
        <div className="px-1.5 py-0.5 rounded-sm bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest">Org</div>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </Link>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);