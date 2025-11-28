// components/courses/CourseAnnouncementsList.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api/axios';
import { Mail, Clock, Loader2, Info, Inbox, Megaphone } from 'lucide-react';

interface AnnouncementItem {
    id: number;
    title: string;
    content: string;
    published_at: string;
    creator_name: string;
    organization_name: string | null;
}

interface CourseAnnouncementsProps {
    courseSlug: string;
}

// 🟢 Helper Component: Empty State (Exactly as requested)
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg bg-muted/50 p-4 max-w-lg mx-auto">
    <Inbox className="h-8 w-8 text-muted-foreground" />
    <p className="text-muted-foreground mt-2 text-center text-sm">{message}</p>
  </div>
);

const CourseAnnouncementsList: React.FC<CourseAnnouncementsProps> = ({ courseSlug }) => {
    const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnnouncements = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/announcements/course/${courseSlug}/`);
            setAnnouncements(response.data); 
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                 setError("Course not found for announcement lookup.");
            } else {
                 setError("Failed to load announcements.");
            }
            setAnnouncements([]);
        } finally {
            setIsLoading(false);
        }
    }, [courseSlug]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary" /> Loading announcements...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                <Info className="w-4 h-4 mr-2" /> Error: {error}
            </div>
        );
    }

    // 🟢 Using the EmptyState component here
    if (announcements.length === 0) {
        return <EmptyState message="There are no announcements posted for this course yet." />;
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
             {/* Header */}
            <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded">
                    <Megaphone className="w-4 h-4 text-primary" />
                </div>
                Course Announcements <span className="text-muted-foreground font-normal text-sm ml-1">({announcements.length})</span>
            </h4>

            {/* Scrollable List Container */}
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                {announcements.map((ann) => (
                    <div 
                        key={ann.id}
                        className="p-5 border border-border rounded bg-card hover:border-primary/30 transition-colors w-full"
                    >
                        {/* Title Section */}
                        <div className="flex items-start gap-3 mb-3 w-full">
                            <Mail className="w-5 h-5 mt-1 text-primary shrink-0" /> 
                            <div className="font-semibold text-lg text-foreground break-words w-full leading-tight">
                                {ann.title}
                            </div>
                        </div>

                        {/* Content Section */}
                        {/* 🟢 Added break-words to handle long words correctly */}
                        <div className="w-full text-sm text-muted-foreground whitespace-pre-wrap pl-8 mb-4 break-words leading-relaxed">
                            {ann.content}
                        </div>

                        {/* Footer Section */}
                        <div className="flex items-center text-xs text-muted-foreground border-t border-border/50 pt-3 pl-8">
                            <Clock className="w-3 h-3 mr-1.5" />
                            <span>
                                Posted on <span className="font-medium text-foreground">{new Date(ann.published_at).toLocaleString()}</span> by <span className="font-medium text-foreground">{ann.creator_name}</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseAnnouncementsList;