"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Bell, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { HeaderMenu } from "@/components/ui/OrgHeaderMenu";
import { useRouter } from "next/navigation"
import OrganizationSwitcher from "@/components/ui/OrganizationSwitcher";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import Image from "next/image";
import { useNotifications } from "@/context/NotificationSocketContext"; 

// Helper function to generate initials
const getInitials = (name: string) => {
    if (!name) return "";
    
    const words = name.trim().split(/\s+/);
    
    // If single word, take first 3 chars (e.g. Safaricom -> SAF)
    if (words.length === 1) {
        return name.slice(0, 3).toUpperCase();
    }
    
    // If multiple words, take first letter of each (e.g. University of Nairobi -> UON)
    return words
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 3);
};

export default function OrgNav() {
    const { user, loading, logout } = useAuth();
    const { activeSlug, activeOrg, loadingOrg } = useActiveOrg();
    const router = useRouter()
    const { unreadCount } = useNotifications(); 
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const basePath = activeSlug ? `/${activeSlug}` : "/dashboard";
    const notificationsHref = `${basePath}/notifications`; 

    const orgLogoUrl = activeOrg?.branding?.logo_url;
    const orgName = activeOrg?.name || (activeSlug ? activeSlug.toUpperCase().replace(/-/g, " ") : "Organization Portal");

    const navLinks = [
        { name: "My Dashboard", href: `${basePath}/dashboard` },
        { name: "Announcements", href: `${basePath}/announcements` },
        { name: "Tutors & Team", href: `${basePath}/team` },
    ];

    const [signOutLoading, setSignOutLoading] = useState(false)

    const handleSignOut = async () => {
        try {
        setSignOutLoading(true)
        await logout()
        router.push("/")
        } catch (error) {
        console.error("Logout failed:", error)
        } finally {
        setSignOutLoading(false)
        }
    }

    if (loadingOrg) {
        return (
            <nav className="border-b border-border bg-background z-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            </nav>
        );
    }

    return (
        <nav className="border-b border-border bg-background z-50">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-20">
                    {/* LEFT: Logo/Title */}
                    <div className="flex items-center space-x-6">
                        <Link href={basePath} className="flex items-center space-x-2">
                            {orgLogoUrl ? (
                                <Image
                                    src={orgLogoUrl}
                                    alt={`${orgName} Logo`}
                                    height={48}
                                    width={150}
                                    className="h-12 w-auto object-contain"
                                    priority
                                />
                            ) : (
                                // UPDATED: Responsive Name Logic
                                <span className="text-xl font-extrabold text-primary">
                                    {/* Mobile: Show Initials (e.g. "UON") */}
                                    <span className="md:hidden">
                                        {getInitials(orgName)}
                                    </span>

                                    {/* Desktop: Show Full Name (truncated if very long) */}
                                    <span className="hidden md:block truncate max-w-[200px] lg:max-w-xs">
                                        {orgName}
                                    </span>
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* CENTER: Desktop Links */}
                    <div className="hidden lg:flex items-center space-x-6 font-medium">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className="hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="flex items-center space-x-4">
                        
                        {/* 🔔 Notification Bell */}
                        {!loading && user && (
                            <Link 
                                href={notificationsHref} 
                                className="relative p-2 rounded-full hover:bg-accent transition-colors sm:flex"
                                aria-label={`View notifications. ${unreadCount || 0} unread`}
                            >
                                <Bell className="w-5 h-5 text-gray-700" />
                                {(unreadCount && unreadCount > 0) ? (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                ) : null}
                            </Link>
                        )}

                        {!loading && user && <HeaderMenu />}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 rounded-md hover:bg-accent"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMenuOpen && (
                <div className="md:hidden animate-slide-down px-4 pt-2 pb-6 space-y-2 border-t border-b border-border bg-background absolute w-full z-40 shadow">
                    {activeSlug && (
                        <div className="space-y-1 pt-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block px-3 py-3 font-medium hover:bg-accent rounded-md"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    <hr className="my-2 border-border" />

                    {!loading && user &&
                        (<div className="px-2 py-2">
                            <OrganizationSwitcher />
                        </div>)
                    }

                    <hr className="my-2 border-border" />

                    <button
                        onClick={handleSignOut}
                        disabled={signOutLoading}
                        className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 focus:bg-red-100 dark:hover:bg-red-900/20 dark:focus:bg-red-900/30 cursor-pointer transition-colors font-medium"
                    >
                        {signOutLoading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            )}
        </nav>
    );
}
