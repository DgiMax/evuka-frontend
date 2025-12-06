"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { CartButton } from "../ui/CartButton";
import { useAuth } from "@/context/AuthContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { HeaderMenu } from "@/components/ui/HeaderMenu";
import OrganizationSwitcher from "@/components/ui/OrganizationSwitcher";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"
import { Search, Menu, X, Loader2, Bell } from "lucide-react";
import debounce from "lodash/debounce";
import SearchResultDisplay from "@/components/ui/SearchResultDisplay";
import api from "@/lib/api/axios";
import { useNotifications } from "@/context/NotificationSocketContext";

interface SearchItem {
  id: number;
  model: "course" | "event" | "organization";
  title: string;
  slug: string;
  score: number;
}

interface SearchResults {
  courses: SearchItem[];
  events: SearchItem[];
  organizations: SearchItem[];
}

export default function MainNav() {
  const { user, loading, logout } = useAuth();
  const { activeSlug } = useActiveOrg();
  const router = useRouter()
  const { unreadCount } = useNotifications();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const coursesHref = activeSlug ? `/${activeSlug}/courses` : "/courses";
  const eventsHref = activeSlug ? `/${activeSlug}/events` : "/events";
  const notificationsHref = "/notifications";

  const navLinks = [
    { name: "Courses", href: coursesHref },
    { name: "Events", href: eventsHref },
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

  const fetchSearchResults = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get<SearchResults>("/api/v1/search/", {
        params: { q: query },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search API error:", error);
      setSearchResults({ courses: [], events: [], organizations: [] });
    } finally {
      setIsSearching(false);
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce(fetchSearchResults, 300),
    [fetchSearchResults]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchTerm(input);

    if (input.length > 0) {
      setIsSearchActive(true);
      debouncedSearch(input);
    } else {
      setIsSearchActive(false);
      setSearchResults(null);
    }
  };

  const handleResultSelect = () => {
    setIsSearchActive(false);
    setIsMenuOpen(false);
    setSearchTerm("");
    setSearchResults(null);
  };

  return (
    <>
      <div className="bg-primary text-primary-foreground text-sm py-2 px-4 hidden lg:flex justify-end items-center space-x-2">
        <Link href="https://tutors.e-vuka.com/" className="hover:underline">
          Teach on evuka
        </Link>
        <span className="opacity-70">|</span>
        <Link href="https://tutors.e-vuka.com/create-org/" className="hover:underline">
          Register an Organization
        </Link>
      </div>

      <nav className="border-b border-border bg-background z-50 relative">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-3 md:py-0 md:h-20">
            
            <div className="flex items-center justify-between w-full md:w-auto md:order-1">
              <Link href="/" className="flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="D-Vuka Logo"
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </Link>
              
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 md:hidden">
                {!loading && user && (
                  <Link
                    href={notificationsHref}
                    className="relative p-2 rounded-full hover:bg-accent"
                  >
                    <Bell className="w-6 h-6 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                <CartButton />

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md bg-transparent hover:bg-transparent focus:outline-none focus:ring-0 active:outline-none active:ring-0"
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>

              <div className="hidden lg:flex items-center space-x-6 font-medium md:order-2">
                {navLinks.map((l) => (
                  <Link
                    key={l.name}
                    href={l.href}
                    className="hover:text-primary transition-colors"
                  >
                    {l.name}
                  </Link>
                ))}
              </div>

              <div className="relative hidden md:block lg:hidden md:order-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center font-medium p-2 hover:text-primary"
                >
                  <span>Browse</span>
                  <svg
                    className={cn(
                      "w-5 h-5 ml-1 transition-transform",
                      isDropdownOpen && "rotate-180"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeWidth="2" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-card rounded-md shadow-lg ring-1 ring-border z-30">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="block px-4 py-2 text-sm hover:bg-accent"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full mt-3 md:mt-0 md:flex-grow md:max-w-lg md:mx-6 relative md:order-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-10 py-2 text-sm md:text-base border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => setIsSearchActive(true)}
                  onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
                />

                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary" />
                )}
              </div>

              {isSearchActive && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50">
                  <SearchResultDisplay
                    results={searchResults}
                    loading={isSearching}
                    query={searchTerm}
                    onSelect={handleResultSelect}
                  />
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-2 sm:space-x-4 flex-shrink-0 md:order-3">
              {!loading && user && (
                <Link
                  href={notificationsHref}
                  className="relative p-2 rounded-full hover:bg-accent"
                >
                  <Bell className="w-6 h-6 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {!loading && user && <HeaderMenu />}

              {!user && (
                <div className="flex items-center space-x-4">
                  <Link href="/login" className="hover:text-primary font-medium">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
                  >
                    Register
                  </Link>
                </div>
              )}

              <CartButton />
            </div>

          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden animate-slide-down border-t border-b border-border bg-background absolute w-full z-40 shadow">
            <div className="px-4 pt-2 pb-6 space-y-2">
              
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

              <hr className="my-2 border-border" />

              {!loading && user ? (
                <>
                  <div className="px-2 py-2">
                    <OrganizationSwitcher />
                  </div>

                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>

                  <Link
                    href="/announcements"
                    className="block px-3 py-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Announcements
                  </Link>

                  <Link
                    href="/profile"
                    className="block px-3 py-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block px-3 py-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                  </Link>

                  <hr className="my-2 border-border" />

                  <button
                      onClick={handleSignOut}
                      disabled={signOutLoading}
                      className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 focus:bg-red-100 dark:hover:bg-red-900/20 dark:focus:bg-red-900/30 cursor-pointer transition-colors font-medium"
                  >
                      {signOutLoading ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 px-2 pt-2">
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-2 border rounded-md hover:bg-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <style jsx global>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.25s ease-out forwards;
        }
      `}</style>
    </>
  );
}