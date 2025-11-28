"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface SearchItem {
  id: number;
  model: "course" | "event" | "organization";
  title: string;
  slug: string;
}

interface SearchResults {
  courses?: SearchItem[];
  events?: SearchItem[];
  organizations?: SearchItem[];
}

interface SearchResultDisplayProps {
  results: SearchResults | null;
  loading: boolean;
  query: string;
  onSelect?: () => void;
}

// Helper to format the link
const formatLink = (model: string, slug: string) => {
  switch (model) {
    case "organization":
      return `/organizations/browse/${slug}`;
    case "course":
      return `/courses/${slug}`;
    case "event":
      return `/events/${slug}`;
    default:
      return "#";
  }
};

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

  const totalCount = courses.length + events.length + organizations.length;
  const displayResults = totalCount > 0 && !loading;

  return (
    <div
      // 👇 THIS IS THE FIX: Prevents the input from blurring when clicking the dropdown
      onMouseDown={(e) => e.preventDefault()}
      className="absolute top-full left-0 mt-2 w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl z-40 max-h-96 overflow-y-auto"
    >
      {loading && (
        <div className="p-4 text-center flex items-center justify-center text-primary-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Searching...
        </div>
      )}

      {!loading && totalCount === 0 && results && (
        <div className="p-4 text-center text-muted-foreground">
          No results found for <strong>"{query}"</strong>
        </div>
      )}

      {displayResults && (
        <div className="p-2 space-y-2">
          {/* Courses */}
          {courses.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase text-primary px-2 pt-2 pb-1 border-t border-border">
                Courses
              </h3>
              {courses.map((item) => (
                <Link
                  key={`c-${item.id}`}
                  href={formatLink(item.model, item.slug)}
                  onClick={() => onSelect?.()}
                  className="block px-2 py-1 hover:bg-accent rounded-md transition-colors text-sm truncate"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}

          {/* Events */}
          {events.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase text-primary px-2 pt-2 pb-1 border-t border-border mt-2">
                Events
              </h3>
              {events.map((item) => (
                <Link
                  key={`e-${item.id}`}
                  href={formatLink(item.model, item.slug)}
                  onClick={() => onSelect?.()}
                  className="block px-2 py-1 hover:bg-accent rounded-md transition-colors text-sm truncate"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}

          {/* Organizations */}
          {organizations.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase text-primary px-2 pt-2 pb-1 border-t border-border mt-2">
                Organizations
              </h3>
              {organizations.map((item) => (
                <Link
                  key={`o-${item.id}`}
                  href={formatLink(item.model, item.slug)}
                  onClick={() => onSelect?.()}
                  className="block px-2 py-1 hover:bg-accent rounded-md transition-colors text-sm truncate"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}