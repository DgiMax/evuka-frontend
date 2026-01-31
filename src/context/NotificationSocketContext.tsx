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
import { useActiveOrg } from '@/lib/hooks/useActiveOrg'; 
import api from '@/lib/api/axios';

interface NotificationItem {
    id: number;
    notification_type: 'announcement' | 'system';
    verb: string;
    is_read: boolean;
    created_at: string;
    organization: number | null;
    content_object: any; 
}

interface NotificationContextType {
    unreadCount: number; 
    notifications: NotificationItem[];
    isLoading: boolean;
    refreshNotifications: (slug?: string | null) => Promise<void>; 
    fetchNotifications: (slug?: string | null) => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationSocketContext = createContext<NotificationContextType | undefined>(undefined);

const WebSocketBaseURL = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8080'; 

export function NotificationSocketProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const { activeSlug } = useActiveOrg(); 

    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = useCallback(async (forcedSlug?: string | null) => {
        if (!isAuthenticated || !user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setIsLoading(true);
        try {
            const contextSlug = forcedSlug !== undefined ? forcedSlug : activeSlug;
            
            const response = await api.get(`/notifications/`, {
                headers: {
                    'X-Organization-Slug': contextSlug || ''
                }
            }); 
            
            const data: NotificationItem[] = response.data;
            setNotifications(data);
            
            const unread = data.filter(n => !n.is_read).length;
            setUnreadCount(unread);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user, activeSlug]);

    const markAsRead = useCallback(async (id: number) => {
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await api.post(`/notifications/${id}/mark-read/`, {}, {
                headers: {
                    'X-Organization-Slug': activeSlug || ''
                }
            });
        } catch (error) {
            fetchNotifications();
        }
    }, [fetchNotifications, activeSlug]);

    const markAllAsRead = useCallback(async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);

        try {
            await api.post(`/notifications/mark-all-read/`, {}, {
                headers: {
                    'X-Organization-Slug': activeSlug || ''
                }
            });
        } catch (error) {
            fetchNotifications();
        }
    }, [fetchNotifications, activeSlug]);

    const setupWebSocket = useCallback(async (): Promise<(() => void) | undefined> => {
        if (!isAuthenticated || !user) return;
        
        let token: string;
        try {
            const tokenResponse = await api.get('/users/ws-token/'); 
            token = tokenResponse.data.token;
        } catch (error) {
            return;
        }

        const socketURL = `${WebSocketBaseURL}/ws/notifications/?token=${token}`;
        const socket = new WebSocket(socketURL);

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'push.count.update') {
                    fetchNotifications();
                }
            } catch (e) {
                console.error(e);
            }
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [isAuthenticated, user, fetchNotifications]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications, activeSlug]); 

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

    const contextValue: NotificationContextType = useMemo(() => ({
        unreadCount,
        notifications,
        isLoading,
        refreshNotifications: fetchNotifications,
        fetchNotifications: fetchNotifications,
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
        throw new Error('useNotifications error');
    }
    return context;
}