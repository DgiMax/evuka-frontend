"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { Inbox, Loader2 } from 'lucide-react';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- Components ---
import CourseFilters, { QueryParams } from "@/components/courses/CourseFilters";
import LongCourseCard from "@/components/courses/LongCourseCard";
import CoursesListSkeleton from "@/components/skeletons/CoursesListSkeleton";
// 🟢 Named Import for the component we extracted
import { CategoryNavigation, ViewState } from "@/components/courses/CategoryNavigation"; 

// --- Hooks & API ---
import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";

// --- Types ---
interface Course {
    slug: string;
    title: string;
    thumbnail: string;
    short_description: string;
    instructor_name: string;
    is_enrolled: boolean;
    rating_avg: number;
    price: string;
    enrollment_count: number;
    category: string;
    level: string;
}

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-6 text-center">
      <Inbox className="h-10 w-10 text-gray-400 mb-3" />
      <h3 className="font-semibold text-gray-900">No courses found</h3>
      <p className="text-gray-500 mt-1 text-sm max-w-xs">{message}</p>
    </div>
);

// 🟢 FIX: Added 'export default' here to resolve your error
export default function CoursesClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { activeSlug } = useActiveOrg();
    
    // --- STATE ---
    const [courses, setCourses] = useState<Course[]>([]);
    const [filterData, setFilterData] = useState<any>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- 1. INITIAL FETCH ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsInitialLoading(true);
            try {
                const filtersRes = await api.get("/filters/");
                setFilterData(filtersRes.data);

                const currentSearch = window.location.search; 
                const coursesRes = await api.get(`/courses/${currentSearch}`);
                const coursesData = coursesRes.data;
                setCourses(Array.isArray(coursesData) ? coursesData : coursesData.results || []);
            } catch (err: any) {
                setError(err.message || "Failed to load data.");
            } finally {
                setIsInitialLoading(false);
            }
        };
        fetchInitialData();
    }, [activeSlug]); 

    // --- 2. VIEW STATE CALCULATION ---
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

    // --- 3. FILTERING LOGIC ---
    const fetchCourses = useCallback(async (queryString: string) => {
        setIsFiltering(true);
        try {
            const url = `/courses/?${queryString}`;
            const response = await api.get(url);
            const data = response.data;
            setCourses(Array.isArray(data) ? data : data.results || []);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsFiltering(false);
        }
    }, []);

    const debouncedFetch = useCallback(debounce(fetchCourses, 400), [fetchCourses]);

    const handleFilterChange = (filters: QueryParams) => {
        const params = new URLSearchParams();

        // Maintains context even if sidebar categories are hidden
        if (filters.category && filters.category.length > 0) {
            filters.category.forEach(slug => params.append("category", slug));
        } else if (viewState.mode === 'CHILD' && viewState.activeSub) {
             params.append("category", viewState.activeSub.slug);
        } else if (viewState.mode === 'PARENT' && viewState.activeParent) {
             params.append("category", viewState.activeParent.slug);
        }

        filters.level?.forEach(l => params.append("level", l));
        if (filters.min_price) params.append("min_price", filters.min_price);
        if (filters.max_price) params.append("max_price", filters.max_price);
        
        debouncedFetch(params.toString());
    };

    // --- 4. NAVIGATION HANDLERS ---
    const handleParentSelect = (category: any) => {
        router.push(`?category=${category.slug}`);
        fetchCourses(`category=${category.slug}`);
    };

    const handleChildSelect = (subCategory: any) => {
        router.push(`?category=${subCategory.slug}`);
        fetchCourses(`category=${subCategory.slug}`);
    };

    const handleBack = () => {
        if (viewState.mode === 'CHILD' && viewState.activeParent) {
            router.push(`?category=${viewState.activeParent.slug}`);
            fetchCourses(`category=${viewState.activeParent.slug}`);
        } else {
            router.push(window.location.pathname);
            fetchCourses("");
        }
    };

    // --- 5. SIDEBAR DATA LOGIC (Strict Hierarchy) ---
    const sidebarData = useMemo(() => {
        if (!filterData) return null;

        let categoriesForSidebar: any[] = [];
        
        if (viewState.mode === 'ROOT') {
            categoriesForSidebar = filterData.globalCategories.map((cat: any) => ({
                id: cat.slug, label: cat.name
            }));
        } else if (viewState.mode === 'PARENT' && viewState.activeParent) {
            categoriesForSidebar = filterData.globalSubCategories
                .filter((sub: any) => sub.parent_slug === viewState.activeParent.slug)
                .map((sub: any) => ({ id: sub.slug, label: sub.name }));
        } else if (viewState.mode === 'CHILD') {
            categoriesForSidebar = []; // Hide categories when at bottom level
        }

        return {
            ...filterData,
            categories: categoriesForSidebar, 
            levels: filterData.globalLevels?.map((l:any) => ({ id: l.name, label: l.name })),
        };
    }, [filterData, viewState]);

    return (
        <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
            <div className="w-full p-4 sm:p-6 lg:p-8 bg-white">
                
                {/* 🟢 NAVIGATION: Separated Component */}
                <CategoryNavigation 
                    viewState={viewState}
                    filterData={filterData}
                    isLoading={isInitialLoading}
                    onParentSelect={handleParentSelect}
                    onChildSelect={handleChildSelect}
                    onBack={handleBack}
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* SIDEBAR */}
                    <div className="lg:col-span-1">
                        {sidebarData ? (
                            <CourseFilters 
                                data={sidebarData} 
                                onFilterChange={handleFilterChange} 
                                key={viewState.activeParent ? viewState.activeParent.id : 'root'}
                            />
                        ) : (
                            <CoursesListSkeleton sidebarOnly={true} />
                        )}
                    </div>

                    {/* COURSE LIST */}
                    <div className="lg:col-span-3 relative">
                        {isFiltering && (
                            <div className="absolute inset-0 bg-white/60 z-10 flex items-start justify-center pt-20 backdrop-blur-[1px]">
                                <div className="bg-white p-3 rounded-full shadow-lg border border-gray-100">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#2694C6]" />
                                </div>
                            </div>
                        )}

                        {isInitialLoading ? (
                            <CoursesListSkeleton />
                        ) : error ? (
                            <EmptyState message={`Error: ${error}`} />
                        ) : courses.length > 0 ? (
                            <div className={`space-y-4 transition-opacity duration-200 ${isFiltering ? 'opacity-40' : 'opacity-100'}`}>
                                {courses.map((course) => (
                                    <LongCourseCard
                                        key={course.slug}
                                        slug={course.slug}
                                        title={course.title}
                                        thumbnail={course.thumbnail}
                                        is_enrolled={course.is_enrolled}
                                        description={course.short_description}
                                        instructor={course.instructor_name}
                                        rating={course.rating_avg}
                                        reviewCount={course.enrollment_count}
                                        price={`KES ${course.price}`}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="No courses found matching your criteria." />
                        )}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
}