'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ActiveOrgProvider } from '@/context/ActiveContext';
import { NotificationSocketProvider } from '@/context/NotificationSocketContext'; 
import { GoogleProvider } from "@/context/GoogleProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GoogleProvider>
            <AuthProvider>
                <ActiveOrgProvider>
                    <NotificationSocketProvider>
                        {children}
                    </NotificationSocketProvider>
                </ActiveOrgProvider>
            </AuthProvider>
        </GoogleProvider>
    );
}