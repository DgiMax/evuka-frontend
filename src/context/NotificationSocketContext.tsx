// context/NotificationSocketContext.tsx

"use client";

import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    ReactNode, 
    useCallback, 
    useMemo 
} from 'react';
import { useAuth } from '@/context/AuthContext'; 
import { useActiveOrg } from '@/lib/hooks/useActiveOrg'; // 1. Hook for Context
import api from '@/lib/api/axios';

// Define the shape of a Notification object based on your Serializer
interface NotificationItem {
    id: number;
    notification_type: 'announcement' | 'system';
    verb: string;
    is_read: boolean;
    created_at: string;
    organization: number | null;
    content_object: any; // The full Announcement data
}

interface NotificationContextType {
    unreadCount: number; 
    notifications: NotificationItem[];
    isLoading: boolean;
    refreshNotifications: () => void; 
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationSocketContext = createContext<NotificationContextType | undefined>(undefined);

const WebSocketBaseURL = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8080'; 

export function NotificationSocketProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    
    // 2. We use this to trigger refreshes, but we DON'T pass it in the URL manually.
    // The Axios Interceptor handles the header automatically.
    const { activeSlug } = useActiveOrg(); 

    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // --- 1. Unified Fetch Logic (Inbox Style) ---
    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated || !user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setIsLoading(true);
        try {
            // 3. Simple GET request. 
            // The Backend ViewSet checks 'request.active_organization' automatically.
            const response = await api.get('/notifications/'); 
            
            const data: NotificationItem[] = response.data;
            setNotifications(data);
            
            // Calculate unread count clientside based on the current context list
            const unread = data.filter(n => !n.is_read).length;
            setUnreadCount(unread);

        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user]);

    // --- 2. Action: Mark Single as Read ---
    const markAsRead = useCallback(async (id: number) => {
        // Optimistic Update: Update UI immediately before API finishes
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            // Hit the new endpoint
            await api.post(`/notifications/${id}/mark-read/`);
        } catch (error) {
            console.error("Failed to mark as read:", error);
            // Revert on error (optional)
            fetchNotifications();
        }
    }, [fetchNotifications]);

    // --- 3. Action: Mark ALL as Read (Context Aware) ---
    const markAllAsRead = useCallback(async () => {
        // Optimistic Update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);

        try {
            await api.post(`/notifications/mark-all-read/`);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
            fetchNotifications();
        }
    }, [fetchNotifications]);

    
    // --- 4. WebSocket Connection ---
    const setupWebSocket = useCallback(async (): Promise<(() => void) | undefined> => {
        if (!isAuthenticated || !user) return;
        
        // Step A: Get Token
        let token: string;
        try {
            const tokenResponse = await api.get('/users/ws-token/'); 
            token = tokenResponse.data.token;
        } catch (error) {
            console.error("Failed to acquire WS token:", error);
            return;
        }

        // Step B: Connect
        const socketURL = `${WebSocketBaseURL}/ws/notifications/?token=${token}`;
        const socket = new WebSocket(socketURL);

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // When a real-time push comes in, we re-fetch the list
                // to get the new data and ensure filters are applied correctly.
                if (data.type === 'push.count.update') {
                    console.log("New notification received, refreshing...");
                    fetchNotifications();
                }
            } catch (e) {
                console.error("Error parsing WS message:", e);
            }
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [isAuthenticated, user, fetchNotifications]);


    // --- 5. Effects ---

    // 🌟 THE TRIGGER: Re-fetch whenever Auth state OR Active Org changes.
    // This matches your EventsView pattern exactly.
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications, activeSlug]); 

    // WebSocket Lifecycle
    useEffect(() => {
        let cleanupFunction: (() => void) | undefined;
        const startSocket = async () => {
            cleanupFunction = await setupWebSocket();
        };
        startSocket();
        return () => {
            if (cleanupFunction) cleanupFunction();
        };
    }, [setupWebSocket]); 

    const contextValue = useMemo(() => ({
        unreadCount,
        notifications,
        isLoading,
        refreshNotifications: fetchNotifications,
        markAsRead,
        markAllAsRead
    }), [unreadCount, notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead]);

    return (
        <NotificationSocketContext.Provider value={contextValue}>
            {children}
        </NotificationSocketContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationSocketContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationSocketProvider');
    }
    return context;
}