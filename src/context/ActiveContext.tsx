"use client";

import { createContext, Dispatch, SetStateAction, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import api from '@/lib/api/axios';
import { useAuth } from '@/context/AuthContext';

interface OrganizationData {
    id: number;
    name: string;
    slug: string;
    branding: { logo_url?: string; website?: string } | null;
    policies: any;
    org_type: string;
}

interface IActiveOrgContext {
    activeSlug: string | null;
    setActiveSlug: Dispatch<SetStateAction<string | null>>;
    activeOrg: OrganizationData | null;
    loadingOrg: boolean;
}

export const ActiveContext = createContext<IActiveOrgContext | undefined>(undefined);

export const ActiveOrgProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    
    const [activeSlug, setActiveSlug] = useState<string | null>(null);
    const [activeOrg, setActiveOrg] = useState<OrganizationData | null>(null);
    const [loadingOrg, setLoadingOrg] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    const activeSlugRef = useRef<string | null>(null);

    useEffect(() => {
        if (!isHydrated) return;
        
        activeSlugRef.current = activeSlug;
        console.log('[ActiveContext] Slug changed to:', activeSlug);

        if (activeSlug) {
            localStorage.setItem('activeOrgSlug', activeSlug);
        } else {
            localStorage.removeItem('activeOrgSlug');
        }
    }, [activeSlug, isHydrated]);

    useEffect(() => {
        const stored = localStorage.getItem('activeOrgSlug');
        if (stored && stored !== 'null' && stored !== 'undefined') {
            console.log('[ActiveContext] Restoring slug:', stored);
            setActiveSlug(stored);
            activeSlugRef.current = stored;
        }
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        const interceptorId = api.interceptors.request.use((config) => {
            const currentSlug = activeSlugRef.current;
            
            if (currentSlug) {
                config.headers['X-Organization-Slug'] = currentSlug;
            } else {
                delete config.headers['X-Organization-Slug'];
            }
            return config;
        });

        console.log('[ActiveContext] Interceptor registered');

        return () => {
            api.interceptors.request.eject(interceptorId);
        };
    }, []);

    const fetchOrgData = useCallback(async (slug: string | null) => {
        if (!slug || !isAuthenticated) {
            setActiveOrg(null);
            setLoadingOrg(false);
            return;
        }
        
        setLoadingOrg(true);
        try {
            const res = await api.get(`/organizations/${slug}/details/`);
            setActiveOrg(res.data);
        } catch (error) {
            console.error("Failed to fetch org details", error);
            setActiveOrg(null);
        } finally {
            setLoadingOrg(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isHydrated) {
            fetchOrgData(activeSlug);
        }
    }, [activeSlug, fetchOrgData, isHydrated]);

    return (
        <ActiveContext.Provider
            value={{
                activeSlug,
                setActiveSlug,
                activeOrg,
                loadingOrg,
            }}
        >
            {children}
        </ActiveContext.Provider>
    );
};