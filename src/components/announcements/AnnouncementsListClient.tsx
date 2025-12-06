"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNotifications } from "@/context/NotificationSocketContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import AnnouncementDetailModal from "@/components/announcements/AnnouncementDetailModal"; 
import api from "@/lib/api/axios";
import { Mail, MailOpen, Bell, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";
// 1. Import Skeleton
import AnnouncementsSkeleton from "@/components/skeletons/AnnouncementsSkeleton";

interface AnnouncementItem {
    id: number;
    title: string;
    content: string;
    published_at: string;
    creator_name: string;
    organization_name: string | null;
    is_read: boolean;
}

interface Props {
    courseSlug?: string;
}

export default function AnnouncementsListClient({ courseSlug }: Props) {
    const { refreshNotifications } = useNotifications();
    const { activeSlug, activeOrg } = useActiveOrg();

    const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);
    
    const contextName = courseSlug ? 'Course Announcements' : (activeOrg?.name || 'Announcements');

    // 1. Load Announcements
    const loadAnnouncements = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            let response;
            if (courseSlug) {
                response = await api.get(`/announcements/course/${courseSlug}/`);
            } else if (activeSlug) {
                response = await api.get(`/announcements/`); 
            } else {
                response = await api.get(`/announcements/`);
            }
            setAnnouncements(response.data);
        } catch (err: any) {
            console.error(err);
            setError("Failed to load announcements.");
        } finally {
            setIsLoading(false);
        }
    }, [activeSlug, courseSlug]);

    useEffect(() => {
        loadAnnouncements();
    }, [loadAnnouncements]);

    // 2. Mark As Read Handler
    const handleCardClick = async (announcement: AnnouncementItem) => {
        setSelectedAnnouncement(announcement);

        if (!announcement.is_read) {
            try {
                // Optimistic Update
                setAnnouncements(prev => prev.map(a => 
                    a.id === announcement.id ? { ...a, is_read: true } : a
                ));

                await api.post(`/announcements/${announcement.id}/mark-as-read/`);
                refreshNotifications();
            } catch (err) {
                console.error("Failed to mark as read:", err);
            }
        }
    };

    if (isLoading) {
        return <AnnouncementsSkeleton />;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                        {contextName}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {courseSlug 
                            ? "Recent updates and news for this course." 
                            : "Browse the announcement history."}
                    </p>
                </div>
            </div>
            
            {error ? (
                <div className="p-6 text-center bg-red-50 border border-red-100 rounded-xl text-red-600">
                    <p>{error}</p>
                </div>
            ) : announcements.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <Bell className="w-12 h-12 mb-3 text-gray-300" />
                    <p className="font-medium">No announcements yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {announcements.map((ann) => (
                        <div 
                            key={ann.id}
                            onClick={() => handleCardClick(ann)}
                            className={cn(
                                "group relative flex items-start p-5 border rounded-xl cursor-pointer transition-all duration-200",
                                ann.is_read 
                                    ? "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm" 
                                    : "bg-white border-blue-100 shadow-md ring-1 ring-blue-50 hover:ring-blue-100 hover:shadow-lg translate-x-1"
                            )}
                        >
                            <div className="flex-shrink-0 pt-1 mr-4">
                                {ann.is_read ? (
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <MailOpen className="w-5 h-5 text-gray-400" />
                                    </div>
                                ) : (
                                    <div className="p-2 bg-blue-100 rounded-full relative">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className={cn(
                                        "text-base font-semibold truncate", 
                                        ann.is_read ? "text-gray-600" : "text-gray-900"
                                    )}>
                                        {ann.title}
                                    </h3>
                                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 mt-1">
                                        {new Date(ann.published_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <p className={cn(
                                    "text-sm mt-1.5 line-clamp-2 leading-relaxed",
                                    ann.is_read ? "text-gray-400" : "text-gray-600"
                                )}>
                                    {ann.content}
                                </p>

                                <div className="flex items-center mt-3 text-xs space-x-3 text-gray-500">
                                    {ann.organization_name && (
                                        <span className="flex items-center px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-md font-medium truncate max-w-[150px]">
                                            <Building2 className="w-3 h-3 mr-1 text-gray-400" />
                                            {ann.organization_name}
                                        </span>
                                    )}
                                    <span className="flex items-center">
                                        <User className="w-3 h-3 mr-1 text-gray-400" />
                                        {ann.creator_name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Using the Custom AnnouncementDetailModal */}
            {selectedAnnouncement && (
                <AnnouncementDetailModal
                    announcement={selectedAnnouncement}
                    onClose={() => setSelectedAnnouncement(null)}
                />
            )}
        </div>
    );
}