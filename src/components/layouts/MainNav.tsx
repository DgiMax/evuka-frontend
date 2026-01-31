"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Loader2, Bell, ChevronDown, ChevronRight, Plus, Minus, LayoutDashboard, User, Megaphone, Heart, LogOut } from "lucide-react";
import debounce from "lodash/debounce";

import { CartButton } from "../ui/CartButton";
import { useAuth } from "@/context/AuthContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { HeaderMenu } from "@/components/ui/HeaderMenu";
import OrganizationSwitcher from "@/components/ui/OrganizationSwitcher";
import SearchResultDisplay from "@/components/ui/SearchResultDisplay";
import { useNotifications } from "@/context/NotificationSocketContext";
import api from "@/lib/api/axios";
import { cn } from "@/lib/utils";

interface NavCategory {
  name: string;
  slug: string;
  subcategories: { name: string; slug: string }[];
}

interface NavData {
  courses: NavCategory[];
  books: NavCategory[];
}

export default function MainNav() {
  const { user, loading, logout } = useAuth();
  const { activeSlug } = useActiveOrg();
  const { unreadCount } = useNotifications();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<NavCategory | null>(null);
  const [activeMobileSection, setActiveMobileSection] = useState<string | null>(null);
  const [signOutLoading, setSignOutLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [navData, setNavData] = useState<NavData | null>(null);

  const coursesHref = activeSlug ? `/${activeSlug}/courses` : "/courses";
  const eventsHref = activeSlug ? `/${activeSlug}/events` : "/events";

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const res = await api.get("/core/nav/links/");
        setNavData(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchNav();
  }, []);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen, isSearchOpen]);

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setSignOutLoading(false);
    }
  };

  const fetchSearchResults = useCallback(async (query: string) => {
    if (query.length < 3) return;
    setIsSearching(true);
    try {
      const response = await api.get("/api/v1/search/", { params: { q: query } });
      setSearchResults(response.data);
    } catch (e) {
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const debouncedSearch = useMemo(() => debounce(fetchSearchResults, 300), [fetchSearchResults]);

  const eventFilters = [{ name: "Online", slug: "online" }, { name: "Physical", slug: "physical" }, { name: "Hybrid", slug: "hybrid" }];
  const orgFilters = [{ name: "Schools", slug: "school" }, { name: "Homeschool Networks", slug: "homeschool" }];

  const toggleMobileSection = (section: string) => {
    setActiveMobileSection(activeMobileSection === section ? null : section);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className="lg:sticky lg:-top-[72px] z-50 w-full bg-white" 
      onMouseLeave={() => setHoveredCategory(null)}
    >
      <div className="h-[72px] flex items-center border-b border-gray-100 lg:border-none relative z-[60] bg-white">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0" onClick={() => { setIsMenuOpen(false); setIsSearchOpen(false); }}>
            <img src="/logo.png" alt="Logo" className="h-7 md:h-8 w-auto" />
          </Link>

          <div className="flex-grow max-w-[550px] relative hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full pl-11 pr-10 py-2.5 text-sm border border-gray-300 rounded-full bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  debouncedSearch(e.target.value);
                  setIsSearchActive(true);
                }}
                onFocus={() => setIsSearchActive(true)}
              />
              {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />}
            </div>
            {isSearchActive && searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 z-[100] shadow-xl rounded-md border border-gray-300 bg-white">
                <SearchResultDisplay results={searchResults} loading={isSearching} query={searchTerm} onSelect={() => setIsSearchActive(false)} />
              </div>
            )}
          </div>

          <div className="hidden xl:flex items-center gap-6">
            <div className="relative group py-4">
              <button className="flex items-center gap-1 text-[14px] font-medium text-gray-700 hover:text-primary transition-colors">
                Events <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-[90%] left-0 bg-white border border-gray-300 shadow-md rounded-md py-1.5 min-w-[180px] opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-[60]">
                <Link href={eventsHref} className="block px-4 py-2 text-sm font-bold text-gray-900 border-b border-gray-100 hover:bg-gray-50">All Events</Link>
                {eventFilters.map(f => (
                  <Link key={f.slug} href={`/events?type=${f.slug}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">{f.name} Events</Link>
                ))}
              </div>
            </div>

            <div className="relative group py-4">
              <button className="flex items-center gap-1 text-[14px] font-medium text-gray-700 hover:text-primary transition-colors">
                Organizations <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-[90%] left-0 bg-white border border-gray-300 shadow-md rounded-md py-1.5 min-w-[200px] opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-[60]">
                <Link href="/organizations" className="block px-4 py-2 text-sm font-bold text-gray-900 border-b border-gray-100 hover:bg-gray-50">All Organizations</Link>
                {orgFilters.map(f => (
                  <Link key={f.slug} href={`/organizations?type=${f.slug}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">{f.name}</Link>
                ))}
              </div>
            </div>

            <div className="relative group py-4">
              <Link href="/books" className="flex items-center gap-1 text-[14px] font-medium text-gray-700 hover:text-primary transition-colors">
                Books <ChevronDown className="w-4 h-4" />
              </Link>
              <div className="absolute top-[90%] left-0 bg-white border border-gray-300 shadow-md rounded-md py-1.5 min-w-[220px] opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-[60]">
                <Link href="/books" className="block px-4 py-2 text-sm font-bold text-gray-900 border-b border-gray-100 hover:bg-gray-50">All Books</Link>
                {navData?.books.map(cat => (
                  <Link key={cat.slug} href={`/books?category=${cat.slug}`} className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary group/item">
                    {cat.name} <ChevronRight className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             <button className="lg:hidden p-2" onClick={toggleSearch}>
               {isSearchOpen ? <X className="w-5 h-5 text-gray-600" /> : <Search className="w-5 h-5 text-gray-600" />}
             </button>
             {!loading && user && (
               <Link href="/notifications" className="p-2 relative">
                 <Bell className="w-5 h-5 text-gray-600" />
                 {unreadCount > 0 && <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{unreadCount}</span>}
               </Link>
             )}
             <CartButton />
             {!loading && user ? <HeaderMenu /> : (
               <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-bold border border-black hover:bg-gray-50">Log in</Link>
             )}
             <button onClick={toggleMenu} className="lg:hidden p-2">
               {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </div>

      <div className="border-y border-gray-200 hidden lg:block bg-white relative z-40">
        <div className="container mx-auto px-4 flex items-center justify-center gap-6 xl:gap-10 h-11">
          <Link href={coursesHref} className="text-[13px] font-semibold uppercase tracking-wider text-gray-600 hover:text-primary whitespace-nowrap">All Courses</Link>
          {navData?.courses.map((cat) => (
            <button
              key={cat.slug}
              onMouseEnter={() => setHoveredCategory(cat)}
              className={cn(
                "text-[13px] font-semibold uppercase tracking-wider transition-colors py-3 border-b-2 whitespace-nowrap",
                hoveredCategory?.slug === cat.slug ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-black"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div 
        className={cn(
          "absolute left-0 right-0 bg-primary text-white shadow-lg transition-all duration-300 ease-in-out hidden lg:block z-30",
          hoveredCategory ? "translate-y-0 opacity-100 visible py-4" : "-translate-y-2 opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="container mx-auto px-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            <Link href={`/courses?category=${hoveredCategory?.slug}`} className="text-[13px] text-white font-bold border-r border-white/20 pr-12 hover:underline underline-offset-8">
              All {hoveredCategory?.name}
            </Link>
            {hoveredCategory?.subcategories.map(sub => (
              <Link key={sub.slug} href={`/courses?category=${hoveredCategory.slug}&sub=${sub.slug}`} className="text-[13px] text-white/80 hover:text-white transition-colors flex items-center gap-2 group/sub">
                {sub.name} <ChevronRight className="w-3 h-3 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={cn(
        "lg:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-gray-200 p-4 z-50 transition-all duration-200 transform",
        isSearchOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-2 opacity-0 invisible"
      )}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for courses, books..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedSearch(e.target.value);
              setIsSearchActive(true);
            }}
          />
        </div>
        {isSearchActive && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-1 shadow-2xl bg-white max-h-[60vh] overflow-y-auto border-t">
            <SearchResultDisplay results={searchResults} loading={isSearching} query={searchTerm} onSelect={() => { setIsSearchActive(false); setIsSearchOpen(false); }} />
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 top-[72px] bg-white z-[55] flex flex-col">
          <div className="flex-grow overflow-y-auto px-6 py-4">
            {!loading && user && (
              <div className="mb-6 w-full">
                <OrganizationSwitcher 
                  fullWidth={true} 
                  height="h-16"
                  triggerClassName="border-gray-300"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button onClick={() => toggleMobileSection('courses')} className="flex items-center justify-between py-4 border-b text-lg font-bold text-gray-900">
                Courses {activeMobileSection === 'courses' ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-gray-400" />}
              </button>
              {activeMobileSection === 'courses' && (
                <div className="pl-4 flex flex-col gap-3 py-3 animate-in slide-in-from-top-2">
                  <Link href={coursesHref} className="text-primary font-bold border-b pb-2" onClick={() => setIsMenuOpen(false)}>All Courses</Link>
                  {navData?.courses.map(cat => (
                    <div key={cat.slug} className="flex flex-col gap-1">
                      <Link href={`/courses?category=${cat.slug}`} className="font-semibold text-gray-800" onClick={() => setIsMenuOpen(false)}>{cat.name}</Link>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {cat.subcategories.slice(0, 5).map(sub => (
                          <Link key={sub.slug} href={`/courses?category=${cat.slug}&sub=${sub.slug}`} className="text-sm text-gray-500" onClick={() => setIsMenuOpen(false)}>{sub.name}</Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => toggleMobileSection('books')} className="flex items-center justify-between py-4 border-b text-lg font-bold text-gray-900">
                Books {activeMobileSection === 'books' ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-gray-400" />}
              </button>
              {activeMobileSection === 'books' && (
                <div className="pl-4 flex flex-col gap-3 py-3 animate-in slide-in-from-top-2">
                  <Link href="/books" className="text-primary font-bold border-b pb-2" onClick={() => setIsMenuOpen(false)}>All Books</Link>
                  {navData?.books.map(cat => (
                    <Link key={cat.slug} href={`/books?category=${cat.slug}`} className="py-1 text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>{cat.name}</Link>
                  ))}
                </div>
              )}

              <button onClick={() => toggleMobileSection('events')} className="flex items-center justify-between py-4 border-b text-lg font-bold text-gray-900">
                Events {activeMobileSection === 'events' ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-gray-400" />}
              </button>
              {activeMobileSection === 'events' && (
                <div className="pl-4 flex flex-col gap-3 py-3 animate-in slide-in-from-top-2">
                  <Link href={eventsHref} className="text-primary font-bold border-b pb-2" onClick={() => setIsMenuOpen(false)}>All Events</Link>
                  {eventFilters.map(f => (
                    <Link key={f.slug} href={`/events?type=${f.slug}`} className="py-1 text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>{f.name} Events</Link>
                  ))}
                </div>
              )}

              <button onClick={() => toggleMobileSection('orgs')} className="flex items-center justify-between py-4 border-b text-lg font-bold text-gray-900">
                Organizations {activeMobileSection === 'orgs' ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-gray-400" />}
              </button>
              {activeMobileSection === 'orgs' && (
                <div className="pl-4 flex flex-col gap-3 py-3 animate-in slide-in-from-top-2">
                  <Link href="/organizations" className="text-primary font-bold border-b pb-2" onClick={() => setIsMenuOpen(false)}>All Organizations</Link>
                  {orgFilters.map(f => (
                    <Link key={f.slug} href={`/organizations?type=${f.slug}`} className="py-1 text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>{f.name}</Link>
                  ))}
                </div>
              )}

              {!loading && user && (
                <div className="mt-4 pt-4 space-y-1 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">My Account</p>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-md font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>
                    <LayoutDashboard className="w-5 h-5 text-gray-400" /> My Dashboard
                  </Link>
                  <Link href="/profile" className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-md font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>
                    <User className="w-5 h-5 text-gray-400" /> My Profile
                  </Link>
                  <Link href="/announcements" className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-md font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>
                    <Megaphone className="w-5 h-5 text-gray-400" /> Announcements
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-md font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>
                    <Heart className="w-5 h-5 text-gray-400" /> Wishlist
                  </Link>
                </div>
              )}

              <div className="mt-4 py-6 border-t border-gray-100 flex flex-col gap-4 text-sm font-medium text-gray-500 pb-8">
                <Link href="https://tutors.e-vuka.com/" className="hover:text-primary">Teach on evuka</Link>
                <Link href="https://tutors.e-vuka.com/create-org/" className="hover:text-primary">Register an Organization</Link>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-6 py-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {!loading && user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="max-w-[150px] overflow-hidden">
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleSignOut} 
                  disabled={signOutLoading}
                  className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-100/50 rounded-md font-bold text-xs transition-colors border border-red-100"
                >
                  <LogOut className="w-3.5 h-3.5" /> 
                  {signOutLoading ? "..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="flex-1 py-3 text-center border border-black font-bold rounded text-sm" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                <Link href="/register" className="flex-1 py-3 text-center bg-black text-white font-bold rounded text-sm" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}