"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Inbox, LayoutGrid, List, SlidersHorizontal, X, Video, MapPin, Zap, Loader2 } from 'lucide-react';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import EventFilters from "@/components/events/EventFilters";
import GridEventCard from "@/components/events/GridEventCard";
import LongEventCard from "@/components/events/LongEventCard";
import CoursesListSkeleton from "@/components/skeletons/CoursesListSkeleton";

import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";

const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-200 rounded-md bg-gray-50/50 p-6 text-center">
      <Inbox className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="font-bold text-gray-900 text-lg">No events found</h3>
      <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">{message}</p>
    </div>
);

export default function EventsClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { activeSlug } = useActiveOrg();
    
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [events, setEvents] = useState<any[]>([]);
    const [filterOptions, setFilterOptions] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const activeType = searchParams.get("type") || "all";

    useEffect(() => {
        const savedMode = localStorage.getItem('eventViewPreference') as 'grid' | 'list';
        if (savedMode) setViewMode(savedMode);
    }, []);

    const handleViewModeChange = (mode: 'grid' | 'list') => {
        setViewMode(mode);
        localStorage.setItem('eventViewPreference', mode);
    };

    const fetchEvents = useCallback(async (params = "") => {
        setIsFiltering(true);
        try {
            const res = await api.get(`events/${params}`);
            setEvents(Array.isArray(res.data) ? res.data : res.data.results || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsFiltering(false);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const [filtersRes] = await Promise.all([
                    api.get("events/filter-options/"),
                    fetchEvents(window.location.search)
                ]);
                setFilterOptions(filtersRes.data);
            } catch (err) { 
                console.error(err); 
            }
        };
        fetchInitial();
    }, [activeSlug, fetchEvents]);

    const handleFilterChange = (params: any) => {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
            if (Array.isArray(val)) val.forEach(v => query.append(key, v));
            else query.append(key, String(val));
        });
        const queryString = `?${query.toString()}`;
        router.push(queryString, { scroll: false });
        fetchEvents(queryString);
    };

    const setType = (type: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (type === "all") params.delete("type");
        else params.set("type", type);
        router.push(`?${params.toString()}`, { scroll: false });
        fetchEvents(`?${params.toString()}`);
    };

    return (
        <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
            <div className="max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-10 bg-white min-h-screen mb-16">
                
                <div className="mb-10">
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
                        {[
                            { id: 'all', label: 'All Events', icon: Zap },
                            { id: 'online', label: 'Online', icon: Video },
                            { id: 'physical', label: 'Physical', icon: MapPin },
                            { id: 'hybrid', label: 'Hybrid', icon: Zap },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setType(t.id)}
                                className={cn(
                                    "flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:px-5 sm:py-2.5 rounded-md text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all border-2",
                                    activeType === t.id 
                                        ? "bg-primary border-primary text-white" 
                                        : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                                )}
                            >
                                <t.icon size={14} className="shrink-0" />
                                <span className="truncate">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center mb-10 border-b border-gray-200 pb-6">
                    <div className="min-w-0">
                        <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight truncate">
                            Marketplace <span className="text-primary">Events</span>
                            <span className="ml-2 text-gray-400 font-medium text-lg md:text-2xl">({events.length})</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-8 flex-shrink-0">
                        <button 
                            onClick={() => setIsMobileFilterOpen(true)} 
                            className="lg:hidden p-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <SlidersHorizontal size={22} />
                        </button>
                        <div className="h-6 w-px bg-gray-200 lg:hidden" />
                        <button onClick={() => handleViewModeChange('list')} className="transition-transform active:scale-90 p-1">
                            <List size={30} className={cn(viewMode === 'list' ? "text-primary" : "text-gray-300")} />
                        </button>
                        <button onClick={() => handleViewModeChange('grid')} className="transition-transform active:scale-90 p-1">
                            <LayoutGrid size={30} className={cn(viewMode === 'grid' ? "text-primary" : "text-gray-300")} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <aside className="hidden lg:block w-[300px] shrink-0">
                        <div className="sticky top-28 border border-gray-200 rounded-md p-5 bg-white">
                            {filterOptions ? (
                                <EventFilters data={filterOptions} onFilterChange={handleFilterChange} />
                            ) : (
                                <CoursesListSkeleton sidebarOnly={true} />
                            )}
                        </div>
                    </aside>

                    {isMobileFilterOpen && (
                        <div className="fixed inset-0 z-[100] lg:hidden">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
                            <div className="absolute inset-y-0 left-0 w-full bg-white flex flex-col animate-in slide-in-from-left duration-300">
                                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <span className="font-black uppercase tracking-tighter text-lg text-gray-900">Filter Events</span>
                                    <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-md"><X size={24} className="text-gray-900" /></button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 bg-white">
                                    {filterOptions && <EventFilters data={filterOptions} onFilterChange={handleFilterChange} />}
                                </div>
                                <div className="p-5 border-t border-gray-100 bg-white sticky bottom-0">
                                    <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-primary text-white py-4 rounded-md font-bold text-sm active:scale-[0.98] transition-all uppercase tracking-wider">
                                        Show {events.length} Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <main className="flex-1 relative">
                        {isFiltering && !isLoading && (
                            <div className="absolute inset-0 bg-white/40 z-20 flex items-start justify-center pt-32 backdrop-blur-[2px]">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            </div>
                        )}
                        
                        {isLoading ? (
                            <CoursesListSkeleton />
                        ) : events.length > 0 ? (
                            <div className={cn(
                                "transition-all duration-300", 
                                viewMode === 'list' 
                                    ? "space-y-6" 
                                    : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                            )}>
                                {events.map((event) => (
                                    viewMode === 'list' 
                                        ? <LongEventCard key={event.slug} event={event} /> 
                                        : <GridEventCard key={event.slug} event={event} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="Try adjusting your timeframe or category to find upcoming sessions." />
                        )}
                    </main>
                </div>
            </div>
        </SkeletonTheme>
    );
}