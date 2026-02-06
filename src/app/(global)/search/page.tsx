"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, BookOpen, Calendar, Building2, 
  BookText, LayoutGrid, List, Loader2,
  ArrowLeft
} from "lucide-react";
import api from "@/lib/api/axios";
import { cn } from "@/lib/utils";

import { SearchEventCard, SearchOrgCard } from "@/components/cards/SearchResultCards";
import CourseCard from "@/components/cards/CourseCard";

type Category = "all" | "courses" | "books" | "events" | "organizations";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const fetchResults = useCallback(async (q: string) => {
    if (!q) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/api/v1/search/?q=${q}`);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(query);
  }, [query, fetchResults]);

  const filterTabs = [
    { id: "all", label: "All Results", icon: Search },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "books", label: "Books", icon: BookText },
    { id: "events", label: "Events", icon: Calendar },
    { id: "organizations", label: "Organizations", icon: Building2 },
  ];

  const getFilteredCount = (tab: Category) => {
    if (!results) return 0;
    if (tab === "all") {
      return (results.courses?.length || 0) + (results.books?.length || 0) + 
             (results.events?.length || 0) + (results.organizations?.length || 0);
    }
    return results[tab]?.length || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <form onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q") as string;
              if (q) router.push(`/search?q=${q}`);
            }}>
              <input
                name="q"
                defaultValue={query}
                placeholder="Search evuka..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-sm focus:ring-1 focus:ring-primary outline-none font-medium text-sm"
              />
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4 mb-4">Categories</h3>
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Category)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === tab.id ? "bg-primary text-white" : "hover:bg-muted text-foreground/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon size={14} />
                    {tab.label}
                  </div>
                  <span className="opacity-50">{getFilteredCount(tab.id as Category)}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
              <h2 className="text-lg font-black uppercase tracking-tight">
                {loading ? "Searching..." : `Found ${getFilteredCount("all")} results for "${query}"`}
              </h2>
              <div className="hidden sm:flex items-center bg-muted/30 p-1 rounded-sm border border-border">
                <button onClick={() => setViewType("grid")} className={cn("p-1.5 rounded-sm transition-all", viewType === "grid" ? "bg-white text-primary" : "text-muted-foreground")}>
                  <LayoutGrid size={14} />
                </button>
                <button onClick={() => setViewType("list")} className={cn("p-1.5 rounded-sm transition-all", viewType === "list" ? "bg-white text-primary" : "text-muted-foreground")}>
                  <List size={14} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Syncing data...</p>
              </div>
            ) : (
              <div className={cn(
                "grid gap-4 md:gap-6",
                viewType === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              )}>
                {(activeTab === "all" || activeTab === "courses") && results?.courses?.map((course: any) => (
                  <CourseCard 
                    key={course.id}
                    title={course.title}
                    description={course.short_description}
                    rating={course.rating_avg || 0}
                    reviewCount={course.num_ratings || 0}
                    imageSrc={course.thumbnail || "/placeholder.png"}
                    courseHref={`/courses/${course.slug}`}
                    className="!shadow-none border border-border h-full"
                  />
                ))}

                {(activeTab === "all" || activeTab === "events") && results?.events?.map((event: any) => (
                  <SearchEventCard 
                    key={event.id}
                    title={event.title}
                    slug={event.slug}
                    description={event.overview}
                    image={event.banner_image}
                  />
                ))}

                {(activeTab === "all" || activeTab === "organizations") && results?.organizations?.map((org: any) => (
                   <SearchOrgCard 
                    key={org.id} 
                    title={org.name}
                    slug={org.slug}
                    description={org.description}
                    image={org.logo}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}