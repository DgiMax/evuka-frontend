"use client";

import React from "react";
import Link from "next/link";
import { Loader2, Search, BookOpen, Calendar, Building2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchItem {
  id: number;
  model: "course" | "event" | "organization" | "book";
  title: string;
  slug: string;
  thumbnail?: string;
}

interface SearchResults {
  courses?: SearchItem[];
  events?: SearchItem[];
  organizations?: SearchItem[];
  books?: SearchItem[];
}

interface SearchResultDisplayProps {
  results: SearchResults | null;
  loading: boolean;
  query: string;
  onSelect?: () => void;
}

const formatLink = (model: string, slug: string) => {
  switch (model) {
    case "organization":
      return `/organizations/${slug}`;
    case "course":
      return `/courses/${slug}`;
    case "event":
      return `/events/${slug}`;
    case "book":
      return `/books/${slug}`;
    default:
      return "#";
  }
};

const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="flex items-center gap-2 px-3 pt-4 pb-2">
    <Icon className="w-3.5 h-3.5 text-primary/60" />
    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
      {title}
    </h3>
  </div>
);

export default function SearchResultDisplay({
  results,
  loading,
  query,
  onSelect,
}: SearchResultDisplayProps) {
  if (!query || query.length < 3) return null;

  const courses = results?.courses ?? [];
  const events = results?.events ?? [];
  const organizations = results?.organizations ?? [];
  const books = results?.books ?? [];

  const totalCount = courses.length + events.length + organizations.length + books.length;

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        "absolute top-full left-0 mt-2 w-full max-w-lg bg-card border border-border rounded-sm z-50",
        "max-h-[450px] overflow-y-auto flex flex-col shadow-sm",
        "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-thumb]:border-x-[1px] [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content"
      )}
    >
      {loading && (
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mb-3" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
            Searching for "{query}"
          </p>
        </div>
      )}

      {!loading && totalCount === 0 && (
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-4">
            <Search className="text-muted-foreground/40" size={20} />
          </div>
          <h3 className="text-sm font-black text-foreground uppercase tracking-widest">No Matches</h3>
          <p className="text-xs text-muted-foreground mt-1 px-8">
            We couldn't find any results for "{query}"
          </p>
        </div>
      )}

      {!loading && totalCount > 0 && (
        <div className="p-2 space-y-4 pb-4">
          {courses.length > 0 && (
            <div>
              <SectionHeader title="Courses" icon={BookOpen} />
              <div className="space-y-1">
                {courses.map((item) => (
                  <Link
                    key={`c-${item.id}`}
                    href={formatLink("course", item.slug)}
                    onClick={() => onSelect?.()}
                    className="flex items-center justify-between group px-3 py-2.5 hover:bg-muted/50 rounded-sm transition-all"
                  >
                    <span className="text-[13px] font-bold text-foreground/80 group-hover:text-primary truncate">
                      {item.title}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {books.length > 0 && (
            <div>
              <SectionHeader title="Library" icon={BookOpen} />
              <div className="space-y-1">
                {books.map((item) => (
                  <Link
                    key={`b-${item.id}`}
                    href={formatLink("book", item.slug)}
                    onClick={() => onSelect?.()}
                    className="flex items-center justify-between group px-3 py-2.5 hover:bg-muted/50 rounded-sm transition-all"
                  >
                    <span className="text-[13px] font-bold text-foreground/80 group-hover:text-primary truncate">
                      {item.title}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {events.length > 0 && (
            <div>
              <SectionHeader title="Events" icon={Calendar} />
              <div className="space-y-1">
                {events.map((item) => (
                  <Link
                    key={`e-${item.id}`}
                    href={formatLink("event", item.slug)}
                    onClick={() => onSelect?.()}
                    className="flex items-center justify-between group px-3 py-2.5 hover:bg-muted/50 rounded-sm transition-all"
                  >
                    <span className="text-[13px] font-bold text-foreground/80 group-hover:text-primary truncate">
                      {item.title}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {organizations.length > 0 && (
            <div>
              <SectionHeader title="Organizations" icon={Building2} />
              <div className="space-y-1">
                {organizations.map((item) => (
                  <Link
                    key={`o-${item.id}`}
                    href={formatLink("organization", item.slug)}
                    onClick={() => onSelect?.()}
                    className="flex items-center justify-between group px-3 py-2.5 hover:bg-muted/50 rounded-sm transition-all"
                  >
                    <span className="text-[13px] font-bold text-foreground/80 group-hover:text-primary truncate">
                      {item.title}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-auto border-t border-border p-3 bg-muted/10">
        <Link
          href={`/search?q=${query}`}
          onClick={() => onSelect?.()}
          className="flex items-center justify-center w-full py-2.5 bg-background border border-border rounded-sm hover:border-primary group transition-all"
        >
          <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">
            View All Results
          </span>
        </Link>
      </div>
    </div>
  );
}