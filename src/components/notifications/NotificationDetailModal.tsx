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

    // Format the date nicely
    const dateObj = new Date(content.published_at);
    const dateStr = dateObj.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        // Overlay: Uses bg-white/20 + backdrop-blur-md for the frosted glass effect (no black bg)
        <div 
            className="fixed inset-0 z-[100] flex justify-center items-center bg-white/20 backdrop-blur-md transition-all duration-300 p-4 sm:p-6"
            onClick={onClose}
        >
            {/* Modal Content */}
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-100 border border-gray-200 ring-1 ring-black/5"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                
                {/* Header */}
                <div className="flex-shrink-0 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 p-5 flex justify-between items-start">
                    <div className="space-y-3 pr-8">
                        {/* Organization Badge */}
                        {content.organization_name && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <Building2 className="w-3 h-3 mr-1" />
                                {content.organization_name}
                            </span>
                        )}
                        
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                            {content.title}
                        </h2>
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-2 transition-all shadow-sm border border-transparent hover:border-gray-200"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Metadata Row (Sticky below header or scrollable) */}
                <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-dashed border-gray-200">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            <User className="w-3.5 h-3.5 mr-2" />
                            <span className="font-medium">{content.creator_name}</span>
                        </div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            <span>{dateStr}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <Clock className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            <span>{timeStr}</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="px-6 py-6 overflow-y-auto custom-scrollbar bg-white">
                    <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {content.content}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm hover:shadow active:scale-95"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}