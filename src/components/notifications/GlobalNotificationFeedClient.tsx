"use client";

import React, { useState } from "react";
import { useNotifications } from "@/context/NotificationSocketContext";
import NotificationDetailModal from "@/components/notifications/NotificationDetailModal";
import { CheckCircle, Mail, MailOpen, Loader2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

// Matches NotificationSerializer structure
interface NotificationItem {
    id: number; // Notification ID
    notification_type: 'announcement' | 'system';
    verb: string;
    is_read: boolean;
    created_at: string;
    organization: number | null;
    content_object: {
        id: number; // Announcement ID
        title: string;
        content: string;
        published_at: string;
        creator_name: string;
        organization_name: string | null;
    };
}

export default function GlobalNotificationFeedClient() {
    // 1. Consume Context
    const { 
        notifications, 
        unreadCount, 
        isLoading, 
        markAsRead, 
        markAllAsRead 
    } = useNotifications();

    // 2. Local state for the Modal content
    const [selectedContent, setSelectedContent] = useState<any | null>(null);

    // 3. Click Handler
    const handleCardClick = (notification: NotificationItem) => {
        // A. Mark as read in backend (via context)
        if (!notification.is_read) {
            markAsRead(notification.id);
        }

        // B. Open Modal if it's an announcement
        if (notification.notification_type === 'announcement' && notification.content_object) {
            setSelectedContent(notification.content_object);
        }
    };

    // 4. Mark All Handler
    const handleMarkAll = async () => {
        if (unreadCount === 0) return;
        if (window.confirm("Mark all visible notifications as read?")) {
            await markAllAsRead();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full shadow-md animate-pulse">
                                {unreadCount} new
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 mt-1">Stay updated with your courses and organizations.</p>
                </div>
                
                <button 
                    onClick={handleMarkAll}
                    disabled={unreadCount === 0 || isLoading}
                    className="flex items-center text-sm px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <CheckCircle className="w-4 h-4 mr-2" /> 
                    Mark All Read
                </button>
            </div>

            {/* List Content */}
            {isLoading && notifications.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                    <p className="font-medium">Loading updates...</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <Bell className="w-12 h-12 mb-3 text-gray-300" />
                    <p className="font-medium">You're all caught up!</p>
                    <p className="text-sm">No new notifications to display.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => {
                        // Ensure content exists before rendering
                        if (!notification.content_object && notification.notification_type === 'announcement') return null;

                        const announcement = notification.content_object;
                        const isSystem = notification.notification_type === 'system';
                        const displayTitle = isSystem ? notification.verb : announcement.title;
                        const displayContent = isSystem ? notification.verb : announcement.content;

                        return (
                            <div
                                key={notification.id}
                                onClick={() => handleCardClick(notification)}
                                className={cn(
                                    "group relative flex items-start p-5 border rounded-xl cursor-pointer transition-all duration-200",
                                    notification.is_read 
                                        ? "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm" 
                                        : "bg-white border-blue-100 shadow-md ring-1 ring-blue-50 hover:ring-blue-100 hover:shadow-lg translate-x-1"
                                )}
                            >
                                {/* Icon Status */}
                                <div className="flex-shrink-0 pt-1 mr-4">
                                    {notification.is_read ? (
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

                                {/* Text Content */}
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className={cn(
                                            "text-base font-semibold truncate", 
                                            notification.is_read ? "text-gray-600" : "text-gray-900"
                                        )}>
                                            {displayTitle}
                                        </h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 mt-1">
                                            {new Date(notification.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className={cn(
                                        "text-sm mt-1.5 line-clamp-2 leading-relaxed",
                                        notification.is_read ? "text-gray-400" : "text-gray-600"
                                    )}>
                                        {displayContent}
                                    </p>

                                    {/* Footer Badges */}
                                    {!isSystem && (
                                        <div className="flex items-center mt-3 text-xs space-x-3">
                                            {announcement.organization_name && (
                                                <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-md text-gray-500 font-medium truncate max-w-[150px]">
                                                    {announcement.organization_name}
                                                </span>
                                            )}
                                            {announcement.creator_name && (
                                                <span className="text-gray-400">by {announcement.creator_name}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal - Renamed to NotificationDetailModal */}
            {selectedContent && (
                <NotificationDetailModal
                    content={selectedContent}
                    onClose={() => setSelectedContent(null)}
                />
            )}
        </div>
    );
}