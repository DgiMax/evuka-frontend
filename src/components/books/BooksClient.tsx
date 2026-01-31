"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { Inbox, Loader2, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import BookFilters from "@/components/books/BookFilters";
import LongBookCard from "@/components/books/LongBookCard";
import { GridBookCard } from "@/components/books/GridBookCard";
import CoursesListSkeleton from "@/components/skeletons/CoursesListSkeleton"; 
import { CategoryNavigation, ViewState } from "@/components/courses/CategoryNavigation"; 

import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";

interface QueryParams {
  category?: string[];
  reading_level?: string[];
  book_format?: string[];
  min_price?: string;
  max_price?: string;
}

const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-200 rounded-md bg-gray-50/50 p-6 text-center">
      <Inbox className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="font-bold text-gray-900 text-lg">No eBooks found</h3>
      <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">{message}</p>
    </div>
);

export default function BooksClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { activeSlug } = useActiveOrg();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [books, setBooks] = useState<any[]>([]);
    const [filterData, setFilterData] = useState<any>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsInitialLoading(true);
            setError(null);
            try {
                const [filtersRes, booksRes] = await Promise.all([
                    api.get("/books/filters/"),
                    api.get(`/books/marketplace/${window.location.search}`)
                ]);
                setFilterData(filtersRes.data);
                const data = booksRes.data;
                setBooks(Array.isArray(data) ? data : data.results || []);
            } catch (err: any) {
                setError(err.message || "Failed to load eBooks.");
                console.error(err);
            } finally {
                setIsInitialLoading(false);
            }
        };
        fetchInitialData();
    }, [activeSlug]);

    const viewState: ViewState = useMemo(() => {
        if (!filterData || !searchParams) return { mode: 'ROOT', activeParent: null, activeSub: null };
        const categorySlug = searchParams.get("category");
        if (!categorySlug) return { mode: 'ROOT', activeParent: null, activeSub: null };
        const mainCat = filterData.globalCategories.find((c: any) => c.slug === categorySlug);
        if (mainCat) return { mode: 'PARENT', activeParent: mainCat, activeSub: null };
        const subCat = filterData.globalSubCategories.find((s: any) => s.slug === categorySlug);
        if (subCat) {
            const parentCat = filterData.globalCategories.find((c: any) => c.slug === subCat.parent_slug);
            return { mode: 'CHILD', activeParent: parentCat, activeSub: subCat };
        }
        return { mode: 'ROOT', activeParent: null, activeSub: null };
    }, [filterData, searchParams]);

    const handleFilterChange = useCallback((filters: QueryParams) => {
        const params = new URLSearchParams();
        if (filters.category?.length) filters.category.forEach(s => params.append("categories__slug", s));
        if (filters.reading_level?.length) filters.reading_level.forEach(l => params.append("reading_level", l));
        if (filters.book_format?.length) filters.book_format.forEach(f => params.append("book_format", f));
        if (filters.min_price) params.append("min_price", filters.min_price);
        if (filters.max_price) params.append("max_price", filters.max_price);
        
        setIsFiltering(true);
        api.get(`/books/marketplace/?${params.toString()}`).then(res => {
            const data = res.data;
            setBooks(Array.isArray(data) ? data : data.results || []);
            setIsFiltering(false);
        }).catch(() => setIsFiltering(false));
    }, []);

    return (
        <div className="max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-10 min-h-screen">
            <CategoryNavigation 
              viewState={viewState} 
              filterData={filterData} 
              isLoading={isInitialLoading} 
              onParentSelect={(c) => router.push(`?category=${c.slug}`)} 
              onChildSelect={(s) => router.push(`?category=${s.slug}`)} 
              onBack={() => router.back()} 
            />

            <div className="flex flex-row justify-between items-center mb-10 mt-10 border-b border-gray-200 pb-6">
                <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">
                    eBook Store <span className="ml-2 text-gray-400 font-medium tracking-normal">({books.length})</span>
                </h1>
                
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden p-2 text-gray-600 border border-gray-200 rounded-md"><SlidersHorizontal size={22} /></button>
                    <div className="h-6 w-px bg-gray-200 lg:hidden" />
                    <button onClick={() => setViewMode('list')} className={cn("p-1 transition-all", viewMode === 'list' ? "text-primary" : "text-gray-300")}><List size={30} /></button>
                    <button onClick={() => setViewMode('grid')} className={cn("p-1 transition-all", viewMode === 'grid' ? "text-primary" : "text-gray-300")}><LayoutGrid size={30} /></button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                <aside className="hidden lg:block w-[300px] shrink-0">
                    <div className="sticky top-28 border border-gray-200 rounded-md p-5 bg-white">
                        {filterData && <BookFilters data={filterData} onFilterChange={handleFilterChange} />}
                    </div>
                </aside>

                {isMobileFilterOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
                        <div className="absolute inset-y-0 left-0 w-full bg-white flex flex-col animate-in slide-in-from-left duration-300">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                <span className="font-black uppercase tracking-tighter text-lg">Filter eBooks</span>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-md"><X size={24}/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                {filterData && <BookFilters data={filterData} onFilterChange={handleFilterChange} />}
                            </div>
                            <div className="p-5 border-t border-gray-100 bg-white">
                                <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-primary text-white py-4 rounded-md font-black text-sm uppercase tracking-widest shadow-md">Show Results</button>
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 relative">
                    {isFiltering && !isInitialLoading && <div className="absolute inset-0 bg-white/40 z-20 flex items-start justify-center pt-32 backdrop-blur-[2px]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}
                    
                    {isInitialLoading ? (
                        <CoursesListSkeleton />
                    ) : error ? (
                        <EmptyState message={error} />
                    ) : books.length > 0 ? (
                        <div className={cn("transition-all duration-300", viewMode === 'list' ? "space-y-6" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6")}>
                            {books.map((book) => (
                                viewMode === 'list' ? <LongBookCard key={book.slug} {...book} /> : <GridBookCard key={book.slug} {...book} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="Try adjusting your filters or search keywords to find what you're looking for." />
                    )}
                </main>
            </div>
        </div>
    );
}