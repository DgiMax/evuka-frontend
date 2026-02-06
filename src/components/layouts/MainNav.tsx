"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, Menu, X, Loader2, Bell, ChevronDown, 
  ChevronRight, Plus, Minus, LayoutDashboard, 
  User, Megaphone, Heart, LogOut, Calendar, 
  Building2, BookText, Globe, MapPin, Users 
} from "lucide-react";
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

  const eventFilters = [
    { name: "Online", slug: "online", icon: Globe, desc: "Virtual interactive sessions" }, 
    { name: "Physical", slug: "physical", icon: MapPin, desc: "In-person local meetups" }, 
    { name: "Hybrid", slug: "hybrid", icon: Users, desc: "Combined learning experiences" }
  ];
  
  const orgFilters = [
    { name: "Schools", slug: "school", icon: Building2, desc: "Verified academic institutions" }, 
    { name: "Homeschool Networks", slug: "homeschool", icon: Heart, desc: "Alternative learning circles" }
  ];

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

  const dropdownBaseClasses = "absolute top-[100%] left-0 bg-white border border-gray-100 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] rounded-sm opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-[70] p-2";

  return (
    <nav 
      className="lg:sticky lg:-top-[72px] z-50 w-full bg-white" 
      onMouseLeave={() => setHoveredCategory(null)}
    >
      <div className="h-[72px] flex items-center border-b border-gray-100 relative z-[60] bg-white">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0" onClick={() => { setIsMenuOpen(false); setIsSearchOpen(false); }}>
            <img src="/logo.png" alt="Logo" className="h-7 md:h-8 w-auto" />
          </Link>

          <div className="flex-grow max-w-[450px] xl:max-w-[550px] relative hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full pl-11 pr-10 py-2.5 text-sm border border-gray-200 rounded-full bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
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
              <div className="absolute top-full left-0 right-0 mt-2 z-[100] shadow-2xl rounded-sm border border-gray-100 bg-white overflow-hidden">
                <SearchResultDisplay results={searchResults} loading={isSearching} query={searchTerm} onSelect={() => setIsSearchActive(false)} />
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-4 xl:gap-7">
            <div className="relative group h-[72px] flex items-center">
              <button className="flex items-center gap-1.5 text-[13px] xl:text-[14px] font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-wider">
                Events <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className={cn(dropdownBaseClasses, "min-w-[260px]")}>
                <Link href={eventsHref} className="flex items-center gap-3 p-3 rounded-sm hover:bg-gray-50 group/item transition-colors border-b border-gray-50 mb-1">
                  <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">All Events</p>
                    <p className="text-[11px] text-gray-500">Discover what&apos;s happening</p>
                  </div>
                </Link>
                {eventFilters.map(f => (
                  <Link key={f.slug} href={`/events?type=${f.slug}`} className="flex items-center gap-3 p-2.5 rounded-sm hover:bg-gray-50 transition-colors group/sub">
                    <f.icon className="w-4 h-4 text-gray-400 group-hover/sub:text-primary" />
                    <div>
                      <p className="text-[13px] font-semibold text-gray-700 group-hover/sub:text-primary">{f.name}</p>
                      <p className="text-[10px] text-gray-400 leading-none mt-0.5">{f.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group h-[72px] flex items-center">
              <button className="flex items-center gap-1.5 text-[13px] xl:text-[14px] font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-wider">
                Organizations <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className={cn(dropdownBaseClasses, "min-w-[280px]")}>
                <Link href="/organizations" className="flex items-center gap-3 p-3 rounded-sm hover:bg-gray-50 group/item transition-colors border-b border-gray-50 mb-1">
                  <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">All Organizations</p>
                    <p className="text-[11px] text-gray-500">Find learning providers</p>
                  </div>
                </Link>
                {orgFilters.map(f => (
                  <Link key={f.slug} href={`/organizations?type=${f.slug}`} className="flex items-center gap-3 p-2.5 rounded-sm hover:bg-gray-50 transition-colors group/sub">
                    <f.icon className="w-4 h-4 text-gray-400 group-hover/sub:text-primary" />
                    <div>
                      <p className="text-[13px] font-semibold text-gray-700 group-hover/sub:text-primary">{f.name}</p>
                      <p className="text-[10px] text-gray-400 leading-none mt-0.5">{f.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group h-[72px] flex items-center">
              <Link href="/books" className="flex items-center gap-1.5 text-[13px] xl:text-[14px] font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-wider">
                Books <ChevronDown className="w-3.5 h-3.5" />
              </Link>
              <div className={cn(dropdownBaseClasses, "min-w-[240px] max-h-[400px] overflow-y-auto")}>
                <Link href="/books" className="flex items-center gap-3 p-3 rounded-sm hover:bg-gray-50 group/item transition-colors border-b border-gray-50 mb-1">
                  <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
                    <BookText size={18} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">Digital Library</p>
                </Link>
                {navData?.books.map(cat => (
                  <Link key={cat.slug} href={`/books?category=${cat.slug}`} className="flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary group/item transition-all">
                    {cat.name} <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3 lg:ml-4">
             <button className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors" onClick={toggleSearch}>
               {isSearchOpen ? <X className="w-5 h-5 text-gray-700" /> : <Search className="w-5 h-5 text-gray-700" />}
             </button>
             {!loading && user && (
               <Link href="/notifications" className="p-2 relative hover:bg-gray-50 rounded-full transition-colors">
                 <Bell className="w-5 h-5 text-gray-700" />
                 {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold border-2 border-white">{unreadCount}</span>}
               </Link>
             )}
             <CartButton />
             {!loading && user ? <HeaderMenu /> : (
               <Link href="/login" className="hidden sm:block px-5 py-2 text-sm font-bold border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all rounded-sm">Log in</Link>
             )}
             <button onClick={toggleMenu} className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors">
               {isMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
             </button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-100 hidden lg:block bg-white relative z-40">
        <div className="container mx-auto px-4 flex items-center justify-center gap-6 xl:gap-12 h-12">
          <Link href={coursesHref} className="text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-primary whitespace-nowrap transition-colors">All Courses</Link>
          {navData?.courses.map((cat) => (
            <button
              key={cat.slug}
              onMouseEnter={() => setHoveredCategory(cat)}
              className={cn(
                "text-[12px] font-bold uppercase tracking-widest transition-all py-4 border-b-2 whitespace-nowrap",
                hoveredCategory?.slug === cat.slug ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-900"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div 
        className={cn(
          "absolute left-0 right-0 bg-primary text-white shadow-2xl transition-all duration-300 ease-in-out hidden lg:block z-30 border-t border-white/10",
          hoveredCategory ? "translate-y-0 opacity-100 visible py-5" : "-translate-y-2 opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="container mx-auto px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            <Link href={`/courses?category=${hoveredCategory?.slug}`} className="text-[12px] text-white font-black uppercase tracking-widest border-r border-white/20 pr-12 hover:opacity-80 transition-opacity">
              Explore {hoveredCategory?.name}
            </Link>
            {hoveredCategory?.subcategories.map(sub => (
              <Link key={sub.slug} href={`/courses?category=${hoveredCategory.slug}&sub=${sub.slug}`} className="text-[12px] font-bold text-white/80 hover:text-white transition-all flex items-center gap-2 group/sub uppercase tracking-wide">
                {sub.name} <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={cn(
        "lg:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-gray-200 p-4 z-50 transition-all duration-300 transform shadow-sm",
        isSearchOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-4 opacity-0 invisible"
      )}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for courses, books..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedSearch(e.target.value);
              setIsSearchActive(true);
            }}
          />
        </div>
        {isSearchActive && searchTerm && (
          <div className="mt-2 bg-white max-h-[60vh] overflow-y-auto rounded-sm border border-gray-100">
            <SearchResultDisplay results={searchResults} loading={isSearching} query={searchTerm} onSelect={() => { setIsSearchActive(false); setIsSearchOpen(false); }} />
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-white z-[55] flex flex-col animate-in fade-in duration-200">
          <div className="flex-grow overflow-y-auto px-5 py-6">
            {!loading && user && (
              <div className="mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Switch Organization</p>
                <OrganizationSwitcher 
                  fullWidth={true} 
                  height="h-14"
                  triggerClassName="border-gray-200 rounded-sm"
                />
              </div>
            )}

            <div className="flex flex-col">
              <button onClick={() => toggleMobileSection('courses')} className="flex items-center justify-between py-4 border-b border-gray-50 text-base font-bold text-gray-900 uppercase tracking-wide">
                Learning Courses {activeMobileSection === 'courses' ? <Minus className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-gray-300" />}
              </button>
              {activeMobileSection === 'courses' && (
                <div className="pl-1 flex flex-col gap-1 py-4 animate-in slide-in-from-top-2">
                  <Link href={coursesHref} className="text-primary font-black py-2 text-sm uppercase tracking-wider mb-4 border-b border-primary/10" onClick={() => setIsMenuOpen(false)}>All Categories</Link>
                  {navData?.courses.map(cat => (
                    <div key={cat.slug} className="mb-5 last:mb-0 border-l-2 border-gray-100 pl-4">
                      <Link href={`/courses?category=${cat.slug}`} className="font-bold text-gray-900 text-[13px] uppercase tracking-tight block mb-2" onClick={() => setIsMenuOpen(false)}>{cat.name}</Link>
                      <div className="grid grid-cols-1 gap-2.5">
                        {cat.subcategories.slice(0, 5).map(sub => (
                          <Link key={sub.slug} href={`/courses?category=${cat.slug}&sub=${sub.slug}`} className="text-xs text-gray-500 font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>{sub.name}</Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => toggleMobileSection('books')} className="flex items-center justify-between py-4 border-b border-gray-50 text-base font-bold text-gray-900 uppercase tracking-wide">
                Digital Library {activeMobileSection === 'books' ? <Minus className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-gray-300" />}
              </button>
              {activeMobileSection === 'books' && (
                <div className="pl-2 flex flex-col gap-2 py-4 animate-in slide-in-from-top-2">
                  <Link href="/books" className="text-primary font-black py-2 text-sm uppercase tracking-wider" onClick={() => setIsMenuOpen(false)}>View All Books</Link>
                  {navData?.books.map(cat => (
                    <Link key={cat.slug} href={`/books?category=${cat.slug}`} className="py-2 text-gray-600 font-bold text-sm" onClick={() => setIsMenuOpen(false)}>{cat.name}</Link>
                  ))}
                </div>
              )}

              <button onClick={() => toggleMobileSection('events')} className="flex items-center justify-between py-4 border-b border-gray-50 text-base font-bold text-gray-900 uppercase tracking-wide">
                Upcoming Events {activeMobileSection === 'events' ? <Minus className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-gray-300" />}
              </button>
              {activeMobileSection === 'events' && (
                <div className="pl-2 flex flex-col gap-2 py-4 animate-in slide-in-from-top-2">
                  <Link href={eventsHref} className="text-primary font-black py-2 text-sm uppercase tracking-wider" onClick={() => setIsMenuOpen(false)}>All Events</Link>
                  {eventFilters.map(f => (
                    <Link key={f.slug} href={`/events?type=${f.slug}`} className="py-2 text-gray-600 font-bold text-sm" onClick={() => setIsMenuOpen(false)}>{f.name} Events</Link>
                  ))}
                </div>
              )}

              <button onClick={() => toggleMobileSection('orgs')} className="flex items-center justify-between py-4 border-b border-gray-50 text-base font-bold text-gray-900 uppercase tracking-wide">
                Organizations {activeMobileSection === 'orgs' ? <Minus className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-gray-300" />}
              </button>
              {activeMobileSection === 'orgs' && (
                <div className="pl-2 flex flex-col gap-2 py-4 animate-in slide-in-from-top-2">
                  <Link href="/organizations" className="text-primary font-black py-2 text-sm uppercase tracking-wider" onClick={() => setIsMenuOpen(false)}>All Providers</Link>
                  {orgFilters.map(f => (
                    <Link key={f.slug} href={`/organizations?type=${f.slug}`} className="py-2 text-gray-600 font-bold text-sm" onClick={() => setIsMenuOpen(false)}>{f.name}</Link>
                  ))}
                </div>
              )}

              {!loading && user && (
                <div className="mt-6 pt-6 space-y-1 border-t border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-4">Account & Settings</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/dashboard" className="flex flex-col gap-2 p-4 bg-gray-50 rounded-sm" onClick={() => setIsMenuOpen(false)}>
                      <LayoutDashboard className="w-5 h-5 text-primary" /> 
                      <span className="text-xs font-bold text-gray-700">Dashboard</span>
                    </Link>
                    <Link href="/my-library" className="flex flex-col gap-2 p-4 bg-gray-50 rounded-sm" onClick={() => setIsMenuOpen(false)}>
                      <BookText className="w-5 h-5 text-primary" /> 
                      <span className="text-xs font-bold text-gray-700">My Books</span>
                    </Link>
                    <Link href="/profile" className="flex flex-col gap-2 p-4 bg-gray-50 rounded-sm" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-5 h-5 text-primary" /> 
                      <span className="text-xs font-bold text-gray-700">Profile</span>
                    </Link>
                    <Link href="/announcements" className="flex flex-col gap-2 p-4 bg-gray-50 rounded-sm" onClick={() => setIsMenuOpen(false)}>
                      <Megaphone className="w-5 h-5 text-primary" /> 
                      <span className="text-xs font-bold text-gray-700">News</span>
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-8 py-8 border-t border-gray-100 flex flex-col gap-5 text-xs font-black uppercase tracking-widest text-gray-400 pb-12">
                <Link href="https://tutors.e-vuka.com/" className="hover:text-primary transition-colors">Teach on evuka</Link>
                <Link href="https://tutors.e-vuka.com/create-or/" className="hover:text-primary transition-colors">Register an Organization</Link>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 bg-white border-t border-gray-100 px-5 py-6 pb-10">
            {!loading && user ? (
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center text-white font-black text-lg">
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="max-w-[140px]">
                    <p className="text-[10px] font-black text-gray-900 truncate uppercase tracking-tighter">{user.email?.split('@')[0]}</p>
                    <p className="text-[9px] text-gray-400 truncate tracking-tight">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleSignOut} 
                  disabled={signOutLoading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-sm font-black text-[10px] uppercase tracking-widest border border-red-100 transition-all active:scale-95"
                >
                  {signOutLoading ? "..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="flex-1 py-4 text-center border-2 border-gray-900 font-black uppercase text-[11px] tracking-widest rounded-sm" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                <Link href="/register" className="flex-1 py-4 text-center bg-gray-900 text-white font-black uppercase text-[11px] tracking-widest rounded-sm" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}