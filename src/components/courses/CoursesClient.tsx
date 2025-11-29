"use client";

import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import CourseFilters, { QueryParams } from "@/components/courses/CourseFilters";
import LongCourseCard from "@/components/courses/LongCourseCard";
import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { Inbox, Loader2 } from 'lucide-react';
import CoursesListSkeleton from "@/components/skeletons/CoursesListSkeleton";
// 🟢 Import Skeleton and Theme
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- Interface (unchanged) ---
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

// Empty state component
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-6 text-center">
      <Inbox className="h-10 w-10 text-gray-400 mb-3" />
      <h3 className="font-semibold text-gray-900">No courses found</h3>
      <p className="text-gray-500 mt-1 text-sm max-w-xs">{message}</p>
    </div>
);

export default function CoursesClient() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filterData, setFilterData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { activeSlug } = useActiveOrg();

    const [currentFilters, setCurrentFilters] = useState<QueryParams>({}); 

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const [filtersRes, coursesRes] = await Promise.all([
                    api.get("/filters/"),
                    api.get("/courses/"),
                ]);

                setFilterData(filtersRes.data);
                
                const coursesData = coursesRes.data;
                const coursesArray = Array.isArray(coursesData)
                    ? coursesData
                    : coursesData.results;
                setCourses(coursesArray || []);

            } catch (err: any) {
                setError(err.message || "Failed to load initial data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [activeSlug]); 

    
    const buildQueryString = (filters: QueryParams): string => {
        const params = new URLSearchParams();

        if (filters.category && filters.category.length > 0) {
            filters.category.forEach(slug => {
                params.append("category", slug);
            });
        }

        if (filters.level && filters.level.length > 0) {
            filters.level.forEach(name => {
                params.append("level", name);
            });
        }
        
        if (filters.min_price) {
            params.append("min_price", filters.min_price);
        }
        if (filters.max_price) {
            params.append("max_price", filters.max_price);
        }

        return params.toString();
    };

    const getCourses = useCallback(async (filters: QueryParams) => {
        // NOTE: We only set isLoading to true for initial load. 
        // For filtering, we typically want a subtle indicator or the skeleton if implemented fully.
        // For this component, we'll keep it simple for now and rely on `isLoading` for initial state.
        // If you want a skeleton on filter change, you'd add an `isFiltering` state like in EventsView.
        setIsLoading(true); // Setting this will cover both initial load and filter fetches now.
        setError(null);

        try {
            const queryString = buildQueryString(filters);
            
            const url = `/courses/?${queryString}`;
            const response = await api.get(url);

            const data = response.data;
            const coursesArray = Array.isArray(data) ? data : data.results;
            setCourses(coursesArray || []);
        } catch (err: any) {
            setError(err.message || "Failed to fetch filtered courses.");
            setCourses([]);
        } finally {
            setIsLoading(false);
        }
    }, [buildQueryString]);

    const debouncedGetCourses = useCallback(debounce(getCourses, 400), [getCourses]);

    const handleFilterChange = useCallback((filters: QueryParams) => {
        setCurrentFilters(filters); 
        debouncedGetCourses(filters);
    }, [debouncedGetCourses]);

    return (
        // 1. 🟢 Wrap with SkeletonTheme
        <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
            <div className="w-full p-4 sm:p-6 lg:p-8 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        {filterData ? (
                            <CourseFilters 
                                data={filterData} 
                                onFilterChange={handleFilterChange} 
                            />
                        ) : (
                            // 2. 🟢 Implement Sidebar Loading State
                            (isLoading || error) && (
                                <div className="space-y-6">
                                    <Skeleton height={40} />
                                    <div className="space-y-3">
                                        <Skeleton count={5} height={20} />
                                        <Skeleton height={40} />
                                        <Skeleton count={3} height={20} />
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Events List */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Courses</h2>

                        {/* Since you don't have an `isFiltering` state, we use `isLoading` to cover the initial load */}
                        {isLoading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row gap-4">
                                    <div className="w-full md:w-64 h-40 bg-gray-100 rounded-md animate-pulse" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-6 w-3/4 bg-gray-100 rounded animate-pulse" />
                                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                                        <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                                        <div className="pt-4 flex justify-between">
                                            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                                            <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
                                        </div>
                                    </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <EmptyState message={`Error loading courses: ${error}. Please try refreshing.`} />
                        ) : courses.length > 0 ? (
                            <div className="space-y-4">
                                {courses.map((course) => (
                                    <LongCourseCard
                                        key={course.slug}
                                        slug={course.slug}
                                        title={course.title}
                                        description={course.short_description}
                                        instructor={course.instructor_name}
                                        is_enrolled={course.is_enrolled}
                                        rating={course.rating_avg}
                                        reviewCount={course.enrollment_count}
                                        price={`KES ${course.price}`}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="No courses found matching your current filters. Try broadening your search criteria." />
                        )}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
}