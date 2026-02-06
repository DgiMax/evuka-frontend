"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import CourseCard from "@/components/cards/CourseCard";
import api from "@/lib/api/axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Course {
  slug: string;
  title: string;
  thumbnail: string;
  short_description: string;
  rating_avg: number;
  num_ratings: number;
  price: string;
  num_students: number;
}

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="col-span-full mx-auto w-full">
    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-md bg-muted/30 p-6 shadow-none">
      <Inbox className="h-10 w-10 text-muted-foreground opacity-50" />
      <p className="text-muted-foreground mt-3 text-center text-sm font-medium">{message}</p>
    </div>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="p-0 border border-border rounded-md overflow-hidden bg-card w-full shadow-none">
          <Skeleton height={180} borderRadius={0} />
          <div className="p-4 space-y-3">
            <Skeleton height={20} width="90%" />
            <Skeleton count={1} height={14} />
            <div className="flex justify-between items-center pt-2">
              <Skeleton width={40} height={16} />
              <Skeleton width={60} height={16} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </SkeletonTheme>
);

export default function FeaturedCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/courses/most-popular/");
      const courseList = Array.isArray(response.data) ? response.data.slice(0, 4) : [];
      setCourses(courseList);
    } catch (err) {
      setError("Failed to load featured courses.");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedCourses();
  }, [fetchFeaturedCourses]);

  return (
    <section className="py-16 sm:py-24 bg-background border-t border-border/40 shadow-none">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 sm:mb-16 gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h4 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Featured Courses
            </h4>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md">
              Start your journey with our most popular and highly-rated learning paths.
            </p>
          </div>

          <Link
            href="/courses"
            className="hidden sm:inline-flex items-center justify-center bg-secondary text-secondary-foreground font-black text-xs uppercase tracking-widest py-3 px-8 rounded-md hover:opacity-90 transition-all active:scale-95 shadow-none"
          >
            View All
          </Link>
        </div>

        <div className="w-full">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <EmptyState message={error} />
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {courses.map((course) => (
                <div key={course.slug} className="w-full flex shadow-none">
                  <CourseCard
                    title={course.title}
                    description={course.short_description}
                    rating={course.rating_avg}
                    reviewCount={course.num_ratings}
                    imageSrc={course.thumbnail || "/images.png"}
                    courseHref={`/courses/${course.slug}`}
                    className="!shadow-none !hover:shadow-none border border-border w-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No featured courses found at this time. Check back soon!" />
          )}
        </div>

        <div className="mt-12 flex justify-center sm:hidden px-4">
          <Link
            href="/courses"
            className="w-full text-center bg-secondary text-secondary-foreground font-black text-xs uppercase tracking-widest py-4 px-10 rounded-md hover:opacity-90 transition-all active:scale-95 shadow-none border border-secondary"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}