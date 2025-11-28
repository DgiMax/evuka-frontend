"use client";

import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import CourseFilters, { QueryParams } from "@/components/courses/CourseFilters"; // 🟢 Import QueryParams
import LongCourseCard from "@/components/courses/LongCourseCard";
import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import CoursesListSkeleton from "@/components/skeletons/CoursesListSkeleton";

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

export default function CoursesClient() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filterData, setFilterData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { activeSlug } = useActiveOrg();

    // The filter state from the CourseFilters component
    const [currentFilters, setCurrentFilters] = useState<QueryParams>({}); 

    // --- Initial Data Fetch (unchanged) ---
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
                setError(err.message || "Failed to load data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [activeSlug]); 

    
    // 🟢 CRITICALLY CORRECTED FUNCTION
    const buildQueryString = (filters: QueryParams): string => {
        const params = new URLSearchParams();

        // 1. Categories and Levels (Handle Arrays)
        // Note: The filters object received here (of type QueryParams) 
        // already contains the cleaned arrays of slugs/names.
        
        if (filters.category && filters.category.length > 0) {
            filters.category.forEach(slug => {
                params.append("category", slug); // Append each slug individually
            });
        }

        if (filters.level && filters.level.length > 0) {
            filters.level.forEach(name => {
                params.append("level", name); // Append each name individually
            });
        }
        
        // 2. Price (Handle Strings/Numbers)
        if (filters.min_price) {
            params.append("min_price", filters.min_price);
        }
        if (filters.max_price) {
            params.append("max_price", filters.max_price);
        }

        return params.toString();
    };

    const getCourses = useCallback(async (filters: QueryParams) => {
        setIsLoading(true);
        setError(null);

        try {
            const queryString = buildQueryString(filters);
            
            const url = `/courses/?${queryString}`;
            const response = await api.get(url);

            const data = response.data;
            const coursesArray = Array.isArray(data) ? data : data.results;
            setCourses(coursesArray || []);
        } catch (err: any) {
            setError(err.message);
            setCourses([]);
        } finally {
            setIsLoading(false);
        }
    }, []); 

    const debouncedGetCourses = useCallback(debounce(getCourses, 400), [getCourses]);

    // 🟢 UPDATED: This now receives the already-processed QueryParams object 
    // from the CourseFilters component's useEffect hook.
    const handleFilterChange = useCallback((filters: QueryParams) => {
        setCurrentFilters(filters); 
        debouncedGetCourses(filters);
    }, [debouncedGetCourses]);

    return (
        <div className="w-full p-4 sm:p-6 lg:p-8 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    {filterData ? (
                        <CourseFilters 
                            data={filterData} 
                            onFilterChange={handleFilterChange} 
                        />
                    ) : (
                        !isLoading && !error && <p>Loading filters...</p>
                    )}
                </div>

                <div className="lg:col-span-3">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">All Courses</h2>

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
                        <p className="text-red-500 text-center mt-10">Error: {error}</p>
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
                        <p className="text-gray-600 text-center mt-10">No courses found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}