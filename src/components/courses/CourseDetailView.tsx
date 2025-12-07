"use client";

import { HeartIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CourseModulesClient } from "@/components/courses/CourseModulesClient";
import { CourseActions } from '@/components/courses/CourseActions';
import api from "@/lib/api/axios";
import { useAuth } from "@/context/AuthContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import Link from "next/link";
import CourseDetailSkeleton from "@/components/skeletons/CourseDetailSkeleton";

type IconProps = {
  className?: string;
};

const StarIcon = ({ filled = true, className = "w-5 h-5" }: { filled?: boolean, className?: string }) => (
  <svg className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24">
    <path
      fill="#000"
      d="M12.707 15.707a1 1 0 0 1-1.414 0L5.636 10.05A1 1 0 1 1 7.05 8.636l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414z"
    />
  </svg>
);

const PointIcon = ({ className = "w-6 h-6" }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0"/></svg>
);


// --- TYPE DEFINITIONS (Unchanged) ---
type Lesson = {
  title: string;
  is_preview: boolean;
  estimated_duration_minutes: number;
};
type Module = {
  title: string;
  description: string;
  lessons_count: number;
  lessons: Lesson[];
};
export type CourseDetails = {
  slug: string;
  title: string;
  short_description: string;
  long_description: string;
  learning_objectives: string[];
  promo_video: string;
  thumbnail: string;
  instructor: {
    username: string;
    creator_name: string;
    bio: string;
  };
  organization_name: string;
  category: { name: string; slug: string };
  level: { name: string };
  price: string;
  rating_avg: number;
  num_students: number;
  num_ratings: number;
  modules: Module[];
  is_enrolled: boolean;
  created_at: string;
  updated_at: string;
};

// --- SUB-COMPONENTS (Unchanged) ---
const StickySidebar = ({ course }: { course: CourseDetails }) => (
  <div className="sticky top-2">
    <div className="border border-gray-200 rounded bg-white p-6">
      <p className="text-xs text-gray-500">
        Updated {new Date(course.updated_at).toLocaleDateString() || 'Oct 2025'}
      </p>
      <div className="mt-4 text-sm text-gray-700 space-y-1">
        <p>{course.level?.name || 'Beginner'} • 12 hours total</p>
        <p>{course.num_students || '0'} students</p>
      </div>
      <div className="flex items-center my-3">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < Math.round(course.rating_avg)} />
        ))}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-4">
        KES {course.price || '0.00'}
      </p>
      
      <CourseActions course={course} />
    </div>
  </div>
);
const LearningObjectives = ({ objectives }: { objectives: string[] }) => (
  <div className="border border-gray-200 rounded-md p-6 my-8">
    <h2 className="text-xl font-bold mb-4 text-gray-900">Learning Objectives</h2>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
      {objectives?.length ? (
        objectives.map((obj, index) => (
          <li key={index} className="flex items-start">
            <PointIcon className="w-5 h-5 text-gray-800 mr-3 mt-0.5" />
            <span>{obj}</span>
          </li>
        ))
      ) : (
        <li>No objectives provided</li>
      )}
    </ul>
  </div>
);
const CourseDescription = ({ description }: { description: string }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4 text-gray-900">Course Description</h2>
    <div
      className="space-y-4 text-gray-700"
    >
      {description || 'No description available.'}
    </div>
  </div>
);
const CourseDetailsLoading = () => (
  // ... (Your loading component is unchanged) ...
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
    <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 xl:gap-x-10">
      <aside className="mt-2 lg:mt-0">
        <div className="sticky top-2">
          <div className="border border-gray-200 rounded bg-white p-6">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-gray-300 rounded w-full mb-3"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </aside>
      <main className="lg:col-span-2">
        <div className="aspect-video bg-gray-200 rounded-md mb-6"></div>
        <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-full mb-6"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="border border-gray-200 rounded-md p-6 my-8">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      </main>
    </div>
  </div>
);

export default function CourseDetailView() { 
  const params = useParams(); 
  const slug = params.slug as string; 
  const { activeSlug } = useActiveOrg(); // ✅ ADDED: Get the active context
  
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth(); // Get auth status

  useEffect(() => {
    if (slug && !authLoading) {
      const fetchCourseData = async () => {
        setLoading(true); // Reset loading state on fetch
        setError(null);
        setCourse(null); // Clear old course data
        try {
          // This 'api.get' call is now fully context-aware.
          // The interceptor adds the 'X-Organization-Slug' header
          // based on the 'activeSlug' from the layout.
          const res = await api.get(`/courses/${slug}/`); 
          setCourse(res.data);
        } catch (err: any) {
          console.error(err);
          // Check for a 404 specifically
          if (err.response && err.response.status === 404) {
             setError("Course not found in this context.");
          } else {
             setError("Failed to load course data.");
          }
        } finally {
          setLoading(false);
        }
      };
      
      fetchCourseData();
    }
  }, [slug, user, authLoading, activeSlug]); // ✅ ADDED: activeSlug dependency

  if (loading || authLoading) {
    return <CourseDetailSkeleton />;
  }
  if (error) {
    return (
      <div className="bg-white text-gray-800 font-sans min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white text-gray-800 font-sans min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 xl:gap-x-10">
          {/* Sidebar */}
          <aside className="mt-2 mb-4 lg:mb-0 lg:mt-0">
            <StickySidebar course={course} />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-2">
            <div className="aspect-video bg-gray-900 rounded-md mb-6 flex items-center justify-center">
              <img
                src={course.promo_video || course.thumbnail || '/placeholder.jpg'}
                alt={course.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {course.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {course.short_description || 'No short description available.'}
            </p>
            
            <p className="text-sm text-gray-500 mb-6">
              Instructor:{' '}
              {course.instructor?.username ? (
                <Link 
                  href={`/tutor-profile/${course.instructor.username}`} 
                  className="font-semibold text-[#2694C6] hover:underline"
                >
                  {course.instructor?.creator_name || 'Unknown Instructor'}
                </Link>
              ) : (
                <span className="font-semibold text-gray-500 cursor-default">
                  {course.instructor?.creator_name || 'Unknown Instructor'}
                </span>
              )}
              {' '} — {course.instructor?.bio || 'No bio available.'}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Organization: {course.organization_name || 'Independent'} | Category:{' '}
              {course.category?.name || 'General'}
            </p>

            <LearningObjectives objectives={course.learning_objectives} />
            <CourseDescription description={course.long_description} />
            <CourseModulesClient modules={course.modules} />
          </main>
        </div>
      </div>
    </div>
  );
}