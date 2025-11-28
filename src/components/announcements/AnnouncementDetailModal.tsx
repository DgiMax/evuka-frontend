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

    return (
        // Modal Overlay
        // bg-white/20 + backdrop-blur-md creates the "frosted glass" look without the dark black overlay
        <div 
            className="fixed inset-0 z-[100] flex justify-center items-center bg-white/20 backdrop-blur-md transition-all duration-300" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-100 border border-gray-200 ring-1 ring-black/5"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                {/* Modal Header */}
                <div className="flex-shrink-0 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 p-5 flex justify-between items-start">
                    <div className="pr-8">
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                            {announcement.title}
                        </h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-2 transition-all shadow-sm border border-transparent hover:border-gray-200"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-dashed border-gray-200 text-sm">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            <User className="w-3.5 h-3.5 mr-2" />
                            <span className="font-medium">{announcement.creator_name}</span>
                        </div>
                        
                        {announcement.organization_name && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                <Briefcase className="w-3.5 h-3.5 mr-2" />
                                <span className="font-medium">{announcement.organization_name}</span>
                            </div>
                        )}

                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 ml-auto">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            <span>{new Date(announcement.published_at).toLocaleDateString()}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <Clock className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            <span>{new Date(announcement.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-gray max-w-none text-gray-800 leading-relaxed">
                        <p className="whitespace-pre-wrap font-normal text-base">
                            {announcement.content}
                        </p>
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