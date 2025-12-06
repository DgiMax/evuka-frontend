"use client";

import React from "react";
import { X, Calendar, User, Building2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Interface matches the 'content_object' structure from your API
interface NotificationContent {
    id: number;
    title: string;
    content: string;
    published_at: string;
    creator_name: string;
    organization_name: string | null;
}

interface NotificationDetailModalProps {
    content: NotificationContent; 
    onClose: () => void;
}

export default function NotificationDetailModal({ content, onClose }: NotificationDetailModalProps) {
    if (!content) return null;

    const dateObj = new Date(content.published_at);
    // Use simpler date format for primary display
    const dateStr = dateObj.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div 
            className="fixed inset-0 z-[100] flex justify-center items-start bg-background/80 backdrop-blur-sm transition-all duration-300 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden transform transition-all duration-300 top-[10%] md:top-[15%] translate-y-0 mt-8 sm:mt-12"
                onClick={(e) => e.stopPropagation()}
            >
                
                <div className="p-4 border-b bg-muted/40 rounded-t-xl shrink-0 flex justify-between items-start">
                    <div className="space-y-1 pr-8">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            {content.organization_name && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/30">
                                    <Building2 className="w-3 h-3 mr-1" />
                                    {content.organization_name}
                                </span>
                            )}
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/30">
                                <User className="w-3 h-3 mr-1" />
                                {content.creator_name}
                            </span>
                        </div>
                        
                        <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug">
                            {content.title}
                        </h2>
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground hover:bg-background rounded-full p-1.5 transition-all"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-shrink-0 px-6 py-3 bg-white border-b border-dashed border-border/70">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{dateStr}</span>
                        </div>
                        
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{timeStr}</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 overflow-y-auto flex-1 min-h-0 bg-white">
                    <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {content.content}
                    </div>
                </div>

                <div className="flex-shrink-0 p-4 border-t bg-muted/40 rounded-b-xl flex justify-end">
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