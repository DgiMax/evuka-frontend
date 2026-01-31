"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { Inbox, Loader2, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import CourseFilters from "@/components/courses/CourseFilters";
import LongCourseCard from "@/components/courses/LongCourseCard";
import { GridCourseCard } from "@/components/courses/GridCourseCard";
import CoursesListSkeleton from "@/components/skeletons/CoursesListSkeleton";
import { CategoryNavigation, ViewState } from "@/components/courses/CategoryNavigation"; 

import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";

interface QueryParams {
  category?: string[];
  level?: string[];
  languages?: string[];
  min_price?: string;
  max_price?: string;
}

const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-200 rounded-md bg-gray-50/50 p-6 text-center">
      <Inbox className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="font-bold text-gray-900 text-lg">No results found</h3>
      <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">{message}</p>
    </div>
);

export default function CoursesClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { activeSlug } = useActiveOrg();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [courses, setCourses] = useState<any[]>([]);
    const [filterData, setFilterData] = useState<any>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('courseViewPreference') as 'grid' | 'list';
        if (savedMode) setViewMode(savedMode);
    }, []);

    const handleViewModeChange = (mode: 'grid' | 'list') => {
        setViewMode(mode);
        localStorage.setItem('courseViewPreference', mode);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsInitialLoading(true);
            try {
                const [filtersRes, coursesRes] = await Promise.all([
                    api.get("/filters/"),
                    api.get(`/courses/${window.location.search}`)
                ]);
                setFilterData(filtersRes.data);
                const data = coursesRes.data;
                setCourses(Array.isArray(data) ? data : data.results || []);
            } catch (err: any) {
                setError(err.message || "Failed to load data.");
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

    const fetchCourses = useCallback(async (queryString: string) => {
        setIsFiltering(true);
        try {
            const response = await api.get(`/courses/?${queryString}`);
            const data = response.data;
            setCourses(Array.isArray(data) ? data : data.results || []);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsFiltering(false);
        }
    }, []);

    const debouncedFetch = useMemo(() => debounce(fetchCourses, 400), [fetchCourses]);

    const handleFilterChange = useCallback((filters: QueryParams) => {
        const params = new URLSearchParams();
        if (filters.category?.length) {
            filters.category.forEach((slug: string) => params.append("category", slug));
        } else if (viewState.mode === 'CHILD' && viewState.activeSub) {
             params.append("category", viewState.activeSub.slug);
        } else if (viewState.mode === 'PARENT' && viewState.activeParent) {
             params.append("category", viewState.activeParent.slug);
        }
        filters.level?.forEach((l: string) => params.append("level", l));
        if (filters.min_price) params.append("min_price", filters.min_price);
        if (filters.max_price) params.append("max_price", filters.max_price);
        debouncedFetch(params.toString());
    }, [viewState, debouncedFetch]);

    const handleParentSelect = (category: any) => {
        router.push(`?category=${category.slug}`);
        fetchCourses(`category=${category.slug}`);
    };

    const handleChildSelect = (subCategory: any) => {
        router.push(`?category=${subCategory.slug}`);
        fetchCourses(`category=${subCategory.slug}`);
    };

    const handleBack = () => {
        const target = (viewState.mode === 'CHILD' && viewState.activeParent) ? `?category=${viewState.activeParent.slug}` : window.location.pathname;
        router.push(target);
        fetchCourses(target.includes('?') ? target.split('?')[1] : "");
    };

    const sidebarData = useMemo(() => {
        if (!filterData) return null;
        let cats: any[] = [];
        if (viewState.mode === 'ROOT') {
            cats = filterData.globalCategories.map((cat: any) => ({ id: cat.slug, label: cat.name }));
        } else if (viewState.mode === 'PARENT' && viewState.activeParent) {
            cats = filterData.globalSubCategories.filter((sub: any) => sub.parent_slug === viewState.activeParent.slug).map((sub: any) => ({ id: sub.slug, label: sub.name }));
        }
        return { ...filterData, categories: cats, levels: filterData.globalLevels?.map((l:any) => ({ id: l.name, label: l.name })) };
    }, [filterData, viewState]);

    return (
        <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
            <div className="max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-10 bg-white min-h-screen mb-16">
                <CategoryNavigation viewState={viewState} filterData={filterData} isLoading={isInitialLoading} onParentSelect={handleParentSelect} onChildSelect={handleChildSelect} onBack={handleBack} />

                <div className="flex flex-row justify-between items-center mb-10 mt-10 gap-4 border-b border-gray-200 pb-6">
                    <div className="min-w-0">
                        <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight truncate">
                            {viewState.activeSub?.name || viewState.activeParent?.name || "Marketplace"}
                            <span className="ml-2 text-gray-400 font-medium text-lg md:text-2xl">({courses.length})</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-8 flex-shrink-0">
                        <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden p-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"><SlidersHorizontal size={22} /></button>
                        <div className="h-6 w-px bg-gray-200 lg:hidden" />
                        <button onClick={() => handleViewModeChange('list')} className="transition-transform active:scale-90 p-1"><List size={30} className={cn(viewMode === 'list' ? "text-primary" : "text-gray-300")} /></button>
                        <button onClick={() => handleViewModeChange('grid')} className="transition-transform active:scale-90 p-1"><LayoutGrid size={30} className={cn(viewMode === 'grid' ? "text-primary" : "text-gray-300")} /></button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <aside className="hidden lg:block w-[300px] shrink-0">
                        <div className="sticky top-28 border border-gray-200 rounded-md p-5 bg-white">
                            {sidebarData ? (
                                <CourseFilters data={sidebarData} onFilterChange={handleFilterChange} key={viewState.activeParent ? viewState.activeParent.id : 'root'} />
                            ) : (
                                <CoursesListSkeleton sidebarOnly={true} />
                            )}
                        </div>
                    </aside>

                    {isMobileFilterOpen && (
                        <div className="fixed inset-0 z-[100] lg:hidden">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsMobileFilterOpen(false)} />
                            <div className="absolute inset-y-0 left-0 w-full bg-white flex flex-col animate-in slide-in-from-left duration-300">
                                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <span className="font-black uppercase tracking-tighter text-lg text-gray-900">Filter Results</span>
                                    <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-md"><X size={24} className="text-gray-900" /></button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 bg-white">
                                    {sidebarData && <CourseFilters data={sidebarData} onFilterChange={handleFilterChange} key={viewState.activeParent ? `mob-${viewState.activeParent.id}` : 'mob-root'} />}
                                </div>
                                <div className="p-5 border-t border-gray-100 bg-white sticky bottom-0">
                                    <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-primary text-white py-4 rounded-md font-bold text-sm shadow-md active:scale-[0.98] transition-all uppercase tracking-wider">
                                        Show {courses.length} Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <main className="flex-1 relative">
                        {isFiltering && !isInitialLoading && <div className="absolute inset-0 bg-white/40 z-20 flex items-start justify-center pt-32 backdrop-blur-[2px]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}
                        {isInitialLoading ? <CoursesListSkeleton /> : error ? <EmptyState message={error} /> : courses.length > 0 ? (
                            <div className={cn("transition-all duration-300", viewMode === 'list' ? "space-y-6" : "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 lg:gap-8")}>
                                {courses.map((course) => (
                                    viewMode === 'list' ? (
                                        <LongCourseCard key={course.slug} {...course} price={`${course.price}`} instructor_name={course.instructor_name || course.instructor?.creator_name} reviewCount={course.enrollment_count} rating={course.rating_avg} />
                                    ) : (
                                        <GridCourseCard key={course.slug} {...course} price={`${course.price}`} instructor_name={course.instructor_name || course.instructor?.creator_name} rating_avg={course.rating_avg} enrollment_count={course.enrollment_count} />
                                    )
                                ))}
                            </div>
                        ) : <EmptyState message="Try adjusting your filters or search keywords." />}
                    </main>
                </div>
            </div>
        </SkeletonTheme>
    );
}