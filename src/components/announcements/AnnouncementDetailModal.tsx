"use client";

import React from 'react';
import { X, Clock, User, Briefcase, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";

// --- Interface Definitions ---
interface AnnouncementItem {
    id: number;
    title: string;
    content: string;
    published_at: string;
    creator_name: string;
    organization_name: string | null;
    is_read: boolean;
}

interface ModalProps {
    announcement: AnnouncementItem;
    onClose: () => void;
}

export default function AnnouncementDetailModal({ announcement, onClose }: ModalProps) {
    if (!announcement) return null;

    const dateObj = new Date(announcement.published_at);
    
    const dateStr = dateObj.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

    return (
        // Overlay: Uses theme background with transparency/blur
        <div 
            className="fixed inset-0 z-[100] flex justify-center items-start bg-background/80 backdrop-blur-sm transition-all duration-300 p-4"
            onClick={onClose}
        >
            <div 
                // Top positioning, max height, flex column structure
                className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden transform transition-all duration-300 top-[15%] md:top-[10%] translate-y-0 mt-8 sm:mt-12"
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* Gray Header (Combined Title + Author/Org Metadata) */}
                <div className="flex-shrink-0 bg-muted/40 border-b border-border p-4 sm:p-5 flex justify-between items-start">
                    <div className="space-y-2 pr-8">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug">
                            {announcement.title}
                        </h2>
                        
                        {/* Author and Organization Group */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            
                            {/* Creator */}
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                <User className="w-3 h-3" />
                                <span>{announcement.creator_name}</span>
                            </div>
                            
                            {/* Organization (Optional) */}
                            {announcement.organization_name && (
                                <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    <Briefcase className="w-3 h-3" />
                                    <span>{announcement.organization_name}</span>
                                </div>
                            )}

                            {/* Date/Time Group */}
                            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                                <div className="inline-flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3" />
                                    <span>{dateStr}</span>
                                </div>
                                <span className="text-border">|</span>
                                <div className="inline-flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    <span>{timeStr}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground hover:bg-background rounded-full p-2 transition-all shadow-sm"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Body (Content) */}
                <div className="px-6 py-6 overflow-y-auto flex-1 min-h-0 bg-white">
                    <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        <p className="whitespace-pre-wrap font-normal text-base">
                            {announcement.content}
                        </p>
                    </div>
                </div>

                {/* Gray Footer */}
                <div className="flex-shrink-0 p-4 border-t border-border bg-muted/40 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}