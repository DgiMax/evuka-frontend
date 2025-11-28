'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ActiveOrgProvider } from '@/context/ActiveContext';
import { NotificationSocketProvider } from '@/context/NotificationSocketContext'; 

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ActiveOrgProvider>
                <NotificationSocketProvider>
                    {children}
                </NotificationSocketProvider>
            </ActiveOrgProvider>
        </AuthProvider>
    );
}