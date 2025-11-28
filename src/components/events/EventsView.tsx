"use client";

import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { Inbox, Loader2 } from 'lucide-react';
import EventFilters, { type FiltersState } from "@/components/events/EventFilters";
import EventCard, { type Event } from "@/components/events/EventCard";
import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
// 🟢 Import Skeleton and Theme
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Type for filter options returned by API
type FilterData = {
  event_types?: { id: string; label: string }[];
  categories?: { id: string; label: string }[];
  price_options?: { id: string; label: string }[];
  upcoming_options?: { id: string; label: string }[];
};

// Empty state component
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-6 text-center">
    <Inbox className="h-10 w-10 text-gray-400 mb-3" />
    <h3 className="font-semibold text-gray-900">No events found</h3>
    <p className="text-gray-500 mt-1 text-sm max-w-xs">{message}</p>
  </div>
);

// Main component
export default function EventsView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FiltersState>({} as FiltersState);

  const { activeSlug } = useActiveOrg();

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setEvents([]);
    setFilterOptions(null);

    try {
      const [filtersRes, eventsRes] = await Promise.all([
        api.get("events/filter-options/"),
        api.get("events/"),
      ]);

      setFilterOptions(filtersRes.data);

      const eventsArray = Array.isArray(eventsRes.data)
        ? eventsRes.data
        : eventsRes.data.results;
      setEvents(eventsArray || []);
    } catch (err: any) {
      console.error("Failed to fetch event data:", err);
      setError(err.message || "Failed to load events.");
    } finally {
      setIsLoading(false);
    }
  }, [activeSlug]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Build query string from filters
  const buildQueryString = useCallback((filters: FiltersState): string => {
    const params = new URLSearchParams();

    const activeTypes = Object.keys(filters.type || {}).filter(key => filters.type[key]);
    if (activeTypes.length > 0) params.append("type", activeTypes.join(","));

    if (filters.category && filters.category !== "all") params.append("category", filters.category);
    if (filters.price && filters.price !== "all") params.append("price", filters.price);
    if (filters.upcoming && filters.upcoming !== "all") params.append("upcoming", filters.upcoming);

    return params.toString();
  }, []);

  // Fetch filtered events
  const getFilteredEvents = useCallback(async (filters: FiltersState) => {
    setIsFiltering(true);
    setError(null);
    setCurrentFilters(filters);

    try {
      const queryString = buildQueryString(filters);
      const url = `events/?${queryString}`;
      const response = await api.get(url);

      const eventsArray = Array.isArray(response.data) ? response.data : response.data.results;
      setEvents(eventsArray || []);
    } catch (err: any) {
      console.error("Failed to fetch filtered events:", err);
      setError(err.message || "Failed to apply filters.");
      setEvents([]);
    } finally {
      setIsFiltering(false);
    }
  }, [buildQueryString]);

  const debouncedGetFilteredEvents = useCallback(debounce(getFilteredEvents, 400), [getFilteredEvents]);

  const handleFilterChange = useCallback((filters: FiltersState) => {
    debouncedGetFilteredEvents(filters);
  }, [debouncedGetFilteredEvents]);

  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="w-full p-4 sm:p-6 lg:p-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            {filterOptions ? (
              <EventFilters data={filterOptions} onFilterChange={handleFilterChange} />
            ) : (isLoading || error) && (
              // 🟢 Sidebar Loading State
              <div className="space-y-6">
                 <Skeleton height={40} />
                 <div className="space-y-3">
                   <Skeleton count={5} height={20} />
                 </div>
              </div>
            )}
          </div>

          {/* Events List */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>

            {/* 🟢 UPDATED: Skeleton Grid for Loading/Filtering states */}
            {isLoading || isFiltering ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    {/* Image Placeholder */}
                    <div className="w-full aspect-[16/9] relative">
                        <Skeleton height="100%" className="absolute inset-0" />
                    </div>
                    {/* Content Placeholder */}
                    <div className="p-5 space-y-3">
                       <div className="flex justify-between">
                          <Skeleton width={80} height={14} />
                          <Skeleton width={50} height={20} borderRadius={12} />
                       </div>
                       <Skeleton height={24} width="90%" />
                       <div className="space-y-1 mt-2">
                           <Skeleton height={14} width="60%" />
                           <Skeleton height={14} width="40%" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <EmptyState message={`Error loading events: ${error}`} />
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                {events.map(event => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState message="No events found matching your criteria." />
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}